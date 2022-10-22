type SignUpConfig = {
  apiRoute?: string;
  redirect?: '';
};

const apiRoute = "/api/auth/signup";

export default async function signUp(data: any, config?: SignUpConfig) {
  const res = await fetch(config?.apiRoute || apiRoute, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error((await res.json()).error);
  if(config?.redirect) window.location.replace(config.redirect);
  const result = await res.json()
  console.log(result)
  return result
}
