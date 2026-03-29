import type { H3Event } from "h3";

interface IRequireAuthOptions {
  isAdminOnly?: boolean;
}

export const requireAuth = (event: H3Event, requireAuthOptions?: IRequireAuthOptions) => {
  const { isAdminOnly = false } = requireAuthOptions || {};

  const token = getCookie(event, "auth_token");
  
  if (!token) throw createError({
    statusCode: HTTP_STATUS.NOT_AUTHENTICATED,
    statusMessage: "Not authenticated.",
  });

  const payload = verifyJwt(token);

  if (!payload) throw createError({
    statusCode: HTTP_STATUS.NOT_AUTHENTICATED,
    statusMessage: "Token invalid or expired.",
  });

  if (isAdminOnly) {
    if (!payload.isAdmin) throw createError({
      statusCode: HTTP_STATUS.NOT_AUTHORIZED,
      statusMessage: "Not Authorized.",
    })
  }

  
  return payload;
};

export const verifyUser = (payload: jwtPayload, userId: string) => {
  if (payload.isAdmin) return;

  if (payload.userId !== userId) throw createError({
    statusCode: HTTP_STATUS.NOT_AUTHORIZED,
    statusMessage: "Not Authorized.",
  });

  return;
};