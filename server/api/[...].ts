export default defineEventHandler((event) => {
  throw createError({
    statusCode: 404,
    statusMessage: 'API endpoint not found.',
    data: { path: event.path }
  });
});