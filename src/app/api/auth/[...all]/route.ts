function authenticationDisabled() {
  return Response.json({ error: "Not Found" }, { status: 404 });
}

export { authenticationDisabled as GET, authenticationDisabled as POST };
