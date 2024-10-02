const validate = (token: any) => {
  const validToken = true;
  if (!validToken || !token) {
    return false;
  }
  return true;
};

export function authMiddleware(req: Request): any {//any -> return any object value (bool , string , .. )
  const token = req.headers.get("authorization")?.split(" ")[1];// for split the array to 2 part ,1 ->bearer 2 -> token-value

  return { isValid: validate(token) };
}
