const api = 'https://reqres.in/api/users';

export const Users = async (page: number) => { // fetch data according pagenum
  const response = await fetch(`${api}?page=${page}`);
  if (!response.ok) {
    throw new Error('error fetching from api');
  }
  return response.json(); //return json format of response
  //Parses the response body as JSON and returns a JavaScript object.
};