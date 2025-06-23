using System;
using System.Collections.Generic;

namespace MyTube.Services.Helpers.Responses
{
    public class ErrorResponse : BaseResponse
    {

        #region Fields

        private Dictionary<string, object> _errors;

        #endregion

        #region Properties

        public object Errors { get; private set; }

        #endregion

        #region Constructors

        /// <summary>
        /// Constuctor used for single error
        /// </summary>
        /// <param name="field"></param>
        /// <param name="errorMessage"></param>
        /// <param name="errorCode"></param>
        public ErrorResponse(string field, string errorMessage, string errorCode)
        {
            this.InitializeObjects();
            this.AddError(field, errorMessage, errorCode);
        }

        /// <summary>
        /// Constuctor used for single error
        /// </summary>
        /// <param name="field"></param>
        /// <param name="errorMessage"></param>
        /// <param name="errorCode"></param>
        public ErrorResponse(string field, string errorMessage, int errorCode)
        {
            this.InitializeObjects();
            this.AddError(field, errorMessage, Convert.ToString(errorCode));
        }

        /// <summary>
        /// Constructor used for multiple errors
        /// </summary>
        public ErrorResponse()
        {
            InitializeObjects();
        }

        #endregion

        #region Methods

        private void InitializeObjects()
        {
            this.Errors = new List<object>();
            this._errors = new Dictionary<string, object>();
        }

        /// <summary>
        /// Used to add error for the response
        /// </summary>
        /// <param name="field"></param>
        /// <param name="errorMessage"></param>
        /// <param name="errorCode"></param>
        public void AddError(string field, string errorMessage, string errorCode)
        {

            if (this._errors.ContainsKey(field) == false)
            {
                this._errors.Add(field, new { code = errorCode, field, message = errorMessage });
                this.Errors = this._errors;
            }
        }

        #endregion

    }
}
