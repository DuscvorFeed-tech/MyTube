using Libgpgme;
using System;
using MyTube.Services.Helpers.Logging;
using System.IO;

namespace MyTube.Services.Helpers.Gpg
{
    public class GpgHelper
    {

        private Context _ctx;
        private EngineInfo _info;
        private readonly IWeRaveYouLog _logger;
        private readonly string _email;
        private readonly string _publicKey;
        private readonly string _privateKey;

        /// <summary>
        /// Constructor used for Public and Private keys generation
        /// </summary>
        public GpgHelper(IWeRaveYouLog logger)
        {
            InitializeObjects();
            _logger = logger;
        }

        /// <summary>
        /// Constructor used for encryption
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="email"></param>
        public GpgHelper(IWeRaveYouLog logger, string email, string publicKey)
        {
            InitializeObjects();
            _logger = logger;
            _email = email;
            _publicKey = publicKey;
        }

        public GpgHelper(IWeRaveYouLog logger, string privatKey)
        {
            InitializeObjects();
            _logger = logger;
            _privateKey = privatKey;
        }


        private void InitializeObjects()
        {
            try
            {
                _ctx = new Context();
                _ctx.PinentryMode = PinentryMode.Loopback;

                _info = _ctx.EngineInfo;

                if (_info.Protocol != Protocol.OpenPGP)
                {
                    _ctx.SetEngineInfo(Protocol.OpenPGP, null, null);
                    _info = _ctx.EngineInfo;
                }
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to initialize GPG objects: {ex}");
                _logger.Debug($"Context={_ctx}");
            }
        }

        public GenkeyResult CreateKey(string userName, string email, string privateKey)
        {

            try
            {
                
                IKeyGenerator keygen = _ctx.KeyStore;

                KeyParameters prams = new KeyParameters
                {
                    RealName = userName,
                    Email = email,
                    KeyLength = KeyParameters.KEY_LENGTH_2048,

                    // primary key parameters
                    PubkeyAlgorithm = KeyAlgorithm.RSA,

                    // the primary key algorithm MUST have the "Sign" capability
                    PubkeyUsage = AlgorithmCapability.CanSign | AlgorithmCapability.CanAuth | AlgorithmCapability.CanCert,

                    // subkey parameters (optional)
                    SubkeyLength = KeyParameters.KEY_LENGTH_4096,
                    SubkeyAlgorithm = KeyAlgorithm.RSA,
                    SubkeyUsage = AlgorithmCapability.CanEncrypt,
                    Passphrase = privateKey
                };

                return keygen.GenerateKey(Protocol.OpenPGP, prams);

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to generate Public Key: {ex}");
                _logger.Debug($"RealName={userName} Email={email} Passphrase={privateKey}");
            }

            return null;

        }

        public bool EncryptFile(string file, string encryptedFile)
        {

            bool status = false;

            FileInfo fileInfo = new FileInfo(file);

            if (fileInfo.Exists == true)
            {
                var key = GetPgpKey();
                if (key != null)
                {

                    GpgmeData plainfile = null, cipherfile = null;

                    try
                    {

                        if(System.IO.File.Exists(encryptedFile))
                        {
                            System.IO.File.Delete(encryptedFile);
                        }

                        plainfile = new GpgmeFileData(file);

                        cipherfile = new GpgmeFileData(encryptedFile, FileMode.Create, FileAccess.ReadWrite);

                        _ctx.Encrypt(new Libgpgme.Key[] { key }, EncryptFlags.AlwaysTrust, plainfile, cipherfile);

                        plainfile.Close();
                        cipherfile.Close();

                        status = System.IO.File.Exists(encryptedFile);

                    }
                    catch (Exception ex)
                    {

                        if (cipherfile != null)
                        {
                            cipherfile.Close();
                        }

                        if (plainfile != null)
                        {
                            plainfile.Close();
                        }

                        _logger.Error($"While trying to encrypt file: {ex}");
                        _logger.Debug($"File={file} ");
                    }
                    
                }

            }

            return status;

        }

        private PgpKey GetPgpKey()
        {

            PgpKey userKey = null;

            try
            {

                IKeyStore keyring = _ctx.KeyStore;

                Libgpgme.Key[] keys = keyring.GetKeyList(_email, false);
                if (keys == null || keys.Length == 0)
                {

                    _logger.Error($"While trying to find PGP key in keyring.");
                    _logger.Debug($"Email={_email}");

                    return userKey;

                }


                foreach (Libgpgme.Key key in keys)
                {
                    if (key.Uid != null && key.Fingerprint == _publicKey)
                    {
                        userKey = (PgpKey)key;
                        break;
                    }

                }

                if (userKey == null)
                {
                    _logger.Error($"While trying to find Fingerprint.");
                    _logger.Debug($"Fingerprint={_publicKey}");
                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get PgpKey: {ex}");
                _logger.Debug($"Context={_ctx}");
            }
                    
            return userKey;

        }

        public bool DecryptFile(string encryptedFile, string decryptedFile)
        {

            bool status = false;

            FileInfo fileInfo = new FileInfo(encryptedFile);

            if (fileInfo.Exists == true)
            {

                GpgmeFileData cipherfile = null, plainfile = null;

                try
                {

                    _ctx.SetPassphraseFunction(PassphraseCallbck);

                    cipherfile = new GpgmeFileData(encryptedFile);

                    plainfile = new GpgmeFileData(decryptedFile, FileMode.Create, FileAccess.Write);

                    var decrst = _ctx.Decrypt(cipherfile, plainfile);

                    cipherfile.Close();
                    plainfile.Close();

                    status = System.IO.File.Exists(decryptedFile);

                }
                catch (Exception ex)
                {
                    if(cipherfile != null)
                    {
                        cipherfile.Close();
                    }

                    if (plainfile != null)
                    {
                        plainfile.Close();
                    }

                    _logger.Error($"While trying to decrypt file: {ex}");
                    _logger.Debug($"EncryptedFile={encryptedFile} DecryptedFile={decryptedFile}");
                }

            }
            else
            {
                _logger.Error($"The encrypted file to be decrypted was not found");
                _logger.Debug($"EncryptedFile={encryptedFile} DecryptedFile={decryptedFile}");
            }


            return status;

        }

        private PassphraseResult PassphraseCallbck(Context ctx, PassphraseInfo info, ref char[] passphrase)
        {
            passphrase = _privateKey.ToCharArray();
            return PassphraseResult.Success;
        }
    }
}
