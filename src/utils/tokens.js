import axios from "axios";
import jwt_decode from "jwt-decode";

export function getAccessRole(token) {
  if (isTokenExp(token)) return "";

  return jwt_decode(token).roles[0];
}

export function isTokenExp(token) {
  if (!token) return true;

  let decoded_token = jwt_decode(token);

  if (decoded_token.exp * 1000 < Date.now()) return true;

  return false;
}

export async function revalidateAccessToken() {
  let accessToken = localStorage.getItem("accessToken");

  if (isTokenExp(accessToken)) {
    let refreshToken = localStorage.getItem("refreshToken");

    if (isTokenExp(refreshToken)) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      return false;
    }

    let resp = await axios
      .get("https://orareacs-backend.herokuapp.com/api/refreshToken", {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      })
      .then((result) => {
        localStorage.setItem("accessToken", result.data.accessToken);
        localStorage.setItem("refreshToken", result.data.refreshToken);

        return true;
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        return false;
      });

    return resp;
  }

  return true;
}
