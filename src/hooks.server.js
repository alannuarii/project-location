import dotenv from 'dotenv';
dotenv.config();

export const handle = async ({ event, resolve }) => {
  // Anda bisa menyisipkan environment variable ke dalam event.locals
  event.locals.PUBLIC_API_KEY = process.env.PUBLIC_API_KEY;

  const response = await resolve(event);
  return response;
};
