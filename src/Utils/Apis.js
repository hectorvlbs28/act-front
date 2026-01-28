const apisEndPoints = {
  auth: {
    signUp: "/auth/signup",
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  passwords: {
    getAllPaswords: "/passwords/get/all",
    getValue: "/passwords/get/value/:id",
    createNew: "/passwords/create",
    deleteValue: "/passwords/delete/value/:id",
    update: "/passwords/update/value/:id",
  },
};

export default apisEndPoints;
