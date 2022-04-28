import jwt_decode from "jwt-decode";

export function checkAccessToken(token) {
  if (token === null) {
    return "";
  }

  let decoded_token = jwt_decode(token);

  console.log(decoded_token.exp * 1000);
  console.log(Date.now());

  if (decoded_token.exp * 1000 < Date.now()) return "";

  return decoded_token.roles[0];
}
