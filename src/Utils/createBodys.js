const createSignUpBody = (values) => {
  return {
    name: values.name,
    userName: values.userName,
    password: values.password,
  };
};

const createSignInBody = (userName, password) => {
  return {
    userName,
    password,
  };
};

const createSignOutBody = () => ({});

const createNewPasswordBody = (values) => {
  return {
    name: values.name,
    description: values.description,
    password: values.password,
  };
};

export { createSignUpBody, createSignInBody, createSignOutBody, createNewPasswordBody };
