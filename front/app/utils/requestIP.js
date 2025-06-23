import { config } from 'utils/config';

const URL = config.IP_URL;

class RequestIP {
  static async getIPAddress() {
    const response = await fetch(URL);
    const data = await response.text();
    console.log(data);
    return data;
  }
}

export default RequestIP;
