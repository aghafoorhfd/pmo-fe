export const transformError = (error) => {
  let err = error;
  if (error?.response?.data?.errors) {
    err = error.response.data.errors;
    if (Array.isArray(err)) {
      [err] = err;
    }
  }
  return err;
};
