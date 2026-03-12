export function success(res, data = null, message = "Operation successful", statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}

export function created(res, data = null, message = "Resource created successfully") {
  return success(res, data, message, 201);
}

export function noContent(res) {
  return res.status(204).send();
}
