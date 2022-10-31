export const apiErrorHandling = (response) => {
  if (response && response.status && response.status && "success" === response.status) {
    return response
  } else {
    throw new Error(response.data.message)
  }
}

export default { apiErrorHandling }