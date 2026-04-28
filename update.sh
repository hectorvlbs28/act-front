#!/usr/bin/env bash
# =============================================================================
# update_imports.sh — ACT Frontend
# Reescribe cada archivo con los imports correctos según la nueva estructura.
# Ejecutar DESPUÉS de restructure.sh, desde la raíz del proyecto.
# =============================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_ok()      { echo -e "${GREEN}[OK]${NC}    $1"; }
log_section() { echo -e "\n${BLUE}━━━ $1 ━━━${NC}"; }

write_file() {
  local path="$1"
  mkdir -p "$(dirname "$path")"
  cat > "$path"
  log_ok "$path"
}

if [ ! -f "package.json" ]; then
  echo "Ejecuta desde la raíz del proyecto."
  exit 1
fi

echo ""
echo -e "${BLUE}  ACT Frontend — Actualización de imports${NC}"
echo ""
read -p "  ¿Continuar? (s/N): " confirm
[[ "$confirm" != "s" && "$confirm" != "S" ]] && exit 0

# =============================================================================
# src/main.jsx
# =============================================================================
log_section "main.jsx"

write_file "src/main.jsx" << 'EOF'
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StyledEngineProvider } from "@mui/material/styles";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import App from "./app/router";
import { store, persistor } from "./app/store";
import esMessages from "./lib/i18n/locales/es.json";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <IntlProvider locale="es" messages={esMessages}>
            <App />
          </IntlProvider>
        </PersistGate>
      </Provider>
    </StyledEngineProvider>
  </StrictMode>
);
EOF

# =============================================================================
# src/app/router.jsx
# =============================================================================
log_section "app/"

write_file "src/app/router.jsx" << 'EOF'
import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

import AppTheme from "./theme/AppTheme";
import AppAppBar from "../shared/components/AppBar/AppAppBar";
import Loading from "../shared/components/ui/Loading";
import TokenExpirationChecker from "../shared/components/ui/TokenExpirationChecker";
import SignInProtect from "../shared/components/ui/SignInProtect";
import ProtectedRoute from "../shared/components/ui/ProtectedRoute";
import axiosInstance from "../lib/axios/axiosInstance";
import Links from "../shared/constants/links";
import { selectIsLogged, selectUserToken } from "../features/auth/store/auth.slice";
import { setApiLoading } from "../store/navigation.slice";

const Home      = lazy(() => import("../features/home/Home"));
const SignIn    = lazy(() => import("../features/auth/SignIn"));
const SignUp    = lazy(() => import("../features/auth/SignUp"));
const Passwords = lazy(() => import("../features/passwords/Passwords"));

const App = () => {
  const dispatch    = useDispatch();
  const USER_LOGGED = useSelector(selectIsLogged);
  const USER_TOKEN  = useSelector(selectUserToken);

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        dispatch(setApiLoading({ status: true }));
        if (USER_LOGGED && USER_TOKEN) {
          config.headers.Authorization = `Bearer ${USER_TOKEN}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        dispatch(setApiLoading({ status: false }));
        return response;
      },
      (error) => {
        dispatch(setApiLoading({ status: false }));
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else if (error.name !== "CanceledError") {
          toast.error("An unexpected error occurred.");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [USER_LOGGED, USER_TOKEN, dispatch]);

  return (
    <AppTheme>
      <Toaster />
      <Loading />
      <Router>
        {USER_LOGGED ? <TokenExpirationChecker /> : null}
        <CssBaseline enableColorScheme />
        <AppAppBar />

        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path={Links.home} element={<Home />} />

            <Route element={<SignInProtect />}>
              <Route path={Links.signIn} element={<SignIn />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path={Links.passwords} element={<Passwords />} />
              <Route path={Links.SignUp}    element={<SignUp />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AppTheme>
  );
};

export default App;
EOF

# =============================================================================
# src/app/store.js
# =============================================================================
write_file "src/app/store.js" << 'EOF'
import storage from "redux-persist/lib/storage";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import toast from "react-hot-toast";

import userReducer from "../features/auth/store/auth.slice";
import navigationReducer from "../store/navigation.slice";
import passwordsReducer from "../features/passwords/store/passwords.slice";
import { setApiLoading } from "../store/navigation.slice";
import {
  fetchPasswords,
  fetchPasswordById,
  fetchDeletePasswordById,
} from "../features/passwords/store/passwords.slice";
import { listenerMiddleware } from "../store/middleware/listenerMiddleware";

const createPersistConfig = (key) => ({ key, storage });

const persistedUserReducer = persistReducer(
  createPersistConfig("user"),
  userReducer
);
const persistedPasswordsReducer = persistReducer(
  createPersistConfig("passwords"),
  passwordsReducer
);

export const store = configureStore({
  reducer: {
    User:       persistedUserReducer,
    Navigation: navigationReducer,
    Passwords:  persistedPasswordsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .prepend(listenerMiddleware.middleware),
});

export const persistor = persistStore(store);
EOF

# =============================================================================
# src/app/theme/AppTheme.jsx
# =============================================================================
log_section "app/theme/"

write_file "src/app/theme/AppTheme.jsx" << 'EOF'
import * as React from "react";
import PropTypes from "prop-types";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { inputsCustomizations }     from "./Customizations/Inputs";
import { dataDisplayCustomizations } from "./Customizations/DataDisplay";
import { feedbackCustomizations }    from "./Customizations/Feedback";
import { navigationCustomizations }  from "./Customizations/Navigation";
import { surfacesCustomizations }    from "./Customizations/Surfaces";
import { colorSchemes, typography, shadows, shape } from "./ThemePrimitives";

const AppTheme = (props) => {
  const { children, disableCustomTheme, themeComponents } = props;

  const theme = React.useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
          cssVariables: {
            colorSchemeSelector: "data-mui-color-scheme",
            cssVarPrefix: "template",
          },
          colorSchemes,
          typography,
          shadows,
          shape,
          components: {
            ...inputsCustomizations,
            ...dataDisplayCustomizations,
            ...feedbackCustomizations,
            ...navigationCustomizations,
            ...surfacesCustomizations,
            ...themeComponents,
          },
        });
  }, [disableCustomTheme, themeComponents]);

  if (disableCustomTheme) return <React.Fragment>{children}</React.Fragment>;

  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
};

AppTheme.propTypes = {
  children:           PropTypes.node,
  disableCustomTheme: PropTypes.bool,
  themeComponents:    PropTypes.object,
};

export default AppTheme;
EOF

# Customizations — solo cambia la ruta de ThemePrimitives
for file in DataDisplay Feedback Inputs Navigation Surfaces; do
  src="src/app/theme/Customizations/${file}.jsx"
  # Reemplazar la ruta del import de ThemePrimitives
  sed -i '' "s|from '../../Theme/ThemePrimitives'|from '../ThemePrimitives'|g" "$src" 2>/dev/null || true
  sed -i '' 's|from "../Theme/ThemePrimitives"|from "../ThemePrimitives"|g'     "$src" 2>/dev/null || true
  log_ok "import ThemePrimitives corregido en $src"
done

# =============================================================================
# src/store/navigation.slice.js
# =============================================================================
log_section "store/"

write_file "src/store/navigation.slice.js" << 'EOF'
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  apiLoading: false,
};

export const navigationSlice = createSlice({
  name: "Navigation",
  initialState,
  reducers: {
    setApiLoading: (state, action) => {
      state.apiLoading = action.payload.status;
    },
  },
});

export const { setApiLoading } = navigationSlice.actions;

export const selectApiLoading = (state) => state.Navigation.apiLoading;

export default navigationSlice.reducer;
EOF

# =============================================================================
# src/store/middleware/listenerMiddleware.js
# =============================================================================
write_file "src/store/middleware/listenerMiddleware.js" << 'EOF'
import { createListenerMiddleware } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import { setApiLoading } from "../navigation.slice";
import {
  fetchPasswords,
  fetchPasswordById,
  fetchDeletePasswordById,
} from "../../features/passwords/store/passwords.slice";

export const listenerMiddleware = createListenerMiddleware();

const trackedThunks = [
  fetchPasswords,
  fetchPasswordById,
  fetchDeletePasswordById,
];

trackedThunks.forEach((thunk) => {
  listenerMiddleware.startListening({
    actionCreator: thunk.pending,
    effect: (_, { dispatch }) => {
      dispatch(setApiLoading({ status: true }));
    },
  });

  listenerMiddleware.startListening({
    actionCreator: thunk.fulfilled,
    effect: (_, { dispatch }) => {
      dispatch(setApiLoading({ status: false }));
    },
  });

  listenerMiddleware.startListening({
    actionCreator: thunk.rejected,
    effect: (action, { dispatch }) => {
      dispatch(setApiLoading({ status: false }));
      const message = action.payload || action.error?.message;
      if (message) toast.error(message);
    },
  });
});
EOF

# =============================================================================
# src/store/index.js
# =============================================================================
write_file "src/store/index.js" << 'EOF'
export { store, persistor } from "../app/store";
EOF

# =============================================================================
# src/hooks/useToast.js
# =============================================================================
log_section "hooks/"

write_file "src/hooks/useToast.js" << 'EOF'
import toast from "react-hot-toast";
import { useCallback } from "react";

const DURATION = {
  short:   2000,
  default: 4000,
  long:    6000,
};

const useToast = () => {
  const toastError = useCallback((message, duration = DURATION.default) => {
    if (!message) return;
    toast.error(message, { duration });
  }, []);

  const toastSuccess = useCallback((message, duration = DURATION.default) => {
    if (!message) return;
    toast.success(message, { duration });
  }, []);

  const toastInfo = useCallback((message, duration = DURATION.default) => {
    if (!message) return;
    toast(message, { duration });
  }, []);

  return { toastError, toastSuccess, toastInfo };
};

export default useToast;
EOF

# =============================================================================
# src/shared/constants/
# =============================================================================
log_section "shared/constants/"

write_file "src/shared/constants/toastMessages.js" << 'EOF'
export const TOAST_MESSAGES = {
  auth: {
    sessionExpired: "Tu sesión ha caducado. Por favor, inicia sesión nuevamente.",
    signOutError:   "Error al cerrar sesión.",
    copySuccess:    "Contraseña copiada",
    copyError:      "No se pudo copiar la contraseña",
  },
  passwords: {
    noChanges:   "No se detectaron cambios por guardar.",
    deleteError: "Error al eliminar la contraseña.",
  },
  generic: {
    unexpectedError: "Ocurrió un error inesperado.",
  },
};
EOF

# links.js, enums.js y apis.js solo cambian de nombre/ubicación,
# el script de restructure ya los movió. No necesitan cambios internos.
log_ok "shared/constants/links.js   — sin cambios internos"
log_ok "shared/constants/enums.js   — sin cambios internos"
log_ok "shared/constants/apis.js    — sin cambios internos"

# request.utils.js igual — sin cambios internos
log_ok "shared/utils/request.utils.js — sin cambios internos"

# =============================================================================
# src/features/auth/store/auth.slice.js
# =============================================================================
log_section "features/auth/"

write_file "src/features/auth/store/auth.slice.js" << 'EOF'
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name:                "",
  userName:            "",
  user_id:             "",
  userToken:           "",
  tokenExpirationTime: 0,
  isLogged:            false,
};

export const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setLoginUser: (state, action) => {
      const { name, userName, user_id, userToken, tokenExpirationTime } = action.payload;
      state.name                = name;
      state.userName            = userName;
      state.user_id             = user_id;
      state.userToken           = userToken;
      state.tokenExpirationTime = tokenExpirationTime;
      state.isLogged            = true;
    },
    setSignOutUser: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setLoginUser, setSignOutUser } = userSlice.actions;

export const selectUserToken   = (state) => state.User.userToken;
export const selectTokenExpTime = (state) => state.User.tokenExpirationTime;
export const selectIsLogged    = (state) => state.User.isLogged;
export const selectNameUser    = (state) => state.User.name;

export default userSlice.reducer;
EOF

# =============================================================================
# src/features/auth/service/auth.service.js
# =============================================================================
write_file "src/features/auth/service/auth.service.js" << 'EOF'
import axiosInstance from "../../../lib/axios/axiosInstance";
import apisEndPoints from "../../../shared/constants/apis";

export const postSignUp = async (body) => {
  const response = await axiosInstance.post(apisEndPoints.auth.signUp, body);
  return response.data;
};

export const postSignIn = async (body) => {
  const response = await axiosInstance.post(apisEndPoints.auth.signIn, body);
  return response.data;
};

export const putSignOut = async () => {
  const response = await axiosInstance.put(apisEndPoints.auth.signOut);
  return response.data;
};
EOF

# =============================================================================
# src/features/auth/components/AuthContainer.jsx
# =============================================================================
write_file "src/features/auth/components/AuthContainer.jsx" << 'EOF'
import { styled } from "@mui/material/styles";
import { Stack } from "@mui/material";

const AuthContainer = styled(Stack)(({ theme }) => ({
  height:    "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding:   theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content:         '""',
    display:         "block",
    position:        "absolute",
    zIndex:          -1,
    inset:           0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
    marginTop: "3rem",
  },
}));

export default AuthContainer;
EOF

# =============================================================================
# src/features/auth/components/AuthView.jsx
# =============================================================================
write_file "src/features/auth/components/AuthView.jsx" << 'EOF'
import React from "react";
import { CssBaseline, Typography, Box } from "@mui/material";

import AppTheme from "../../../app/theme/AppTheme";
import AuthContainer from "./AuthContainer";
import CustomCard from "./CustomCard";

const AuthView = ({ title, children }) => {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <AuthContainer direction="column" justifyContent="space-between">
        <CustomCard variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{
              width:     "100%",
              fontSize:  "clamp(2rem, 10vw, 2.15rem)",
              textAlign: "center",
            }}
          >
            {title}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {children}
          </Box>
        </CustomCard>
      </AuthContainer>
    </AppTheme>
  );
};

export default AuthView;
EOF

# =============================================================================
# src/features/auth/SignIn.jsx
# =============================================================================
write_file "src/features/auth/SignIn.jsx" << 'EOF'
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";

import AuthView from "./components/AuthView";
import FormField from "../../shared/components/inputs/FormField";
import PasswordField from "../../shared/components/inputs/PasswordField";
import Links from "../../shared/constants/links";
import { postSignIn } from "./service/auth.service";
import { createSignInBody } from "../../shared/utils/request.utils";
import { setLoginUser } from "./store/auth.slice";
import useToast from "../../hooks/useToast";

const SignIn = () => {
  const intl     = useIntl();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toastError, toastSuccess } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);

  const initialValues = { userName: "", password: "" };

  const validationSchema = Yup.object({
    userName: Yup.string().required(intl.formatMessage({ id: "FieldRequired" })),
    password: Yup.string().required(intl.formatMessage({ id: "FieldRequired" })),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const body = createSignInBody(values.userName, values.password);
      const { message, user, token } = await postSignIn(body);
      toastSuccess(message);
      dispatch(
        setLoginUser({
          name:                user.name,
          userName:            user.userName,
          user_id:             user.user_id,
          userToken:           token.userToken,
          tokenExpirationTime: token.tokenExpirationTime,
        })
      );
      navigate(Links.home);
    } catch (error) {
      toastError(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthView title={intl.formatMessage({ id: "loginTitle" })}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <FormField
              name="userName"
              label={intl.formatMessage({ id: "loginUserNameLabel" })}
              placeholder={intl.formatMessage({ id: "loginUserNamePlaceholder" })}
              error={touched.userName && Boolean(errors.userName)}
              helperText={touched.userName && errors.userName}
            />

            <PasswordField
              name="password"
              label={intl.formatMessage({ id: "loginPasswordLabel" })}
              showPassword={showPassword}
              togglePasswordVisibility={() => setShowPassword((p) => !p)}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />

            <Box display="flex" mt={2}>
              <Button
                loading={loading}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                {intl.formatMessage({ id: "loginTitle" })}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </AuthView>
  );
};

export default SignIn;
EOF

# =============================================================================
# src/features/auth/SignUp.jsx
# =============================================================================
write_file "src/features/auth/SignUp.jsx" << 'EOF'
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";

import AuthView from "./components/AuthView";
import FormField from "../../shared/components/inputs/FormField";
import PasswordField from "../../shared/components/inputs/PasswordField";
import Links from "../../shared/constants/links";
import { postSignUp } from "./service/auth.service";
import { createSignUpBody } from "../../shared/utils/request.utils";
import useToast from "../../hooks/useToast";

const SignUp = () => {
  const intl     = useIntl();
  const navigate = useNavigate();
  const { toastError, toastSuccess } = useToast();

  const [showPassword, setShowPassword]           = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading]                     = useState(false);

  const initialValues = { name: "", userName: "", password: "", repeatPassword: "" };

  const validationSchema = Yup.object({
    name:     Yup.string().required(intl.formatMessage({ id: "FieldRequired" })),
    userName: Yup.string().required(intl.formatMessage({ id: "FieldRequired" })),
    password: Yup.string().required(intl.formatMessage({ id: "FieldRequired" })),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], intl.formatMessage({ id: "PasswordsMustMatch" }))
      .required(intl.formatMessage({ id: "FieldRequired" })),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const body = createSignUpBody(values);
      const { message } = await postSignUp(body);
      toastSuccess(message);
      resetForm();
      navigate(Links.home);
    } catch (error) {
      toastError(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthView title={intl.formatMessage({ id: "signUp" })}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <FormField
              name="name"
              label={intl.formatMessage({ id: "Name" })}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />

            <FormField
              name="userName"
              label={intl.formatMessage({ id: "loginUserNameLabel" })}
              error={touched.userName && Boolean(errors.userName)}
              helperText={touched.userName && errors.userName}
            />

            <PasswordField
              name="password"
              label={intl.formatMessage({ id: "Password" })}
              showPassword={showPassword}
              togglePasswordVisibility={() => setShowPassword((p) => !p)}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />

            <PasswordField
              name="repeatPassword"
              label={intl.formatMessage({ id: "RepeatPassword" })}
              showPassword={showRepeatPassword}
              togglePasswordVisibility={() => setShowRepeatPassword((p) => !p)}
              error={touched.repeatPassword && Boolean(errors.repeatPassword)}
              helperText={touched.repeatPassword && errors.repeatPassword}
            />

            <Box display="flex" mt={2}>
              <Button
                loading={loading}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                {intl.formatMessage({ id: "Submit" })}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </AuthView>
  );
};

export default SignUp;
EOF

# =============================================================================
# src/features/passwords/store/passwords.slice.js
# =============================================================================
log_section "features/passwords/"

write_file "src/features/passwords/store/passwords.slice.js" << 'EOF'
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getAllPaswords,
  getPasswordValueById,
  deletePasswordValueById,
} from "../service/passwords.service";
import { PasswordModalTypes } from "../../../shared/constants/enums";

const initialState = {
  passLoading:   false,
  error:         null,
  passwordsList: [],
  needUpdate:    false,
  passwordSelected: {
    open:          false,
    name:          "",
    description:   "",
    pswdDecrypted: "",
    type:          "",
    id:            "",
  },
  newPassword: {
    open:          false,
    name:          "",
    description:   "",
    password:      "",
    id:            "",
    type:          "",
  },
};

export const fetchPasswords = createAsyncThunk(
  "Passwords/fetchPasswords",
  async ({ refresh = false }, thunkAPI) => {
    const state = thunkAPI.getState().Passwords;
    if (!refresh && state.passwordsList.length > 0) {
      return thunkAPI.fulfillWithValue({
        message:       "No fetch needed",
        passwordsList: state.passwordsList,
      });
    }
    try {
      const { message, passwordsList } = await getAllPaswords();
      return { message, passwordsList };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchPasswordById = createAsyncThunk(
  "Passwords/fetchPasswordById",
  async ({ id, name, description, type }, thunkAPI) => {
    try {
      const { pswdDecrypted } = await getPasswordValueById(id);
      return { open: true, name, description, pswdDecrypted, type, id };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchDeletePasswordById = createAsyncThunk(
  "Passwords/fetchDeletePasswordById",
  async ({ id }, thunkAPI) => {
    try {
      await deletePasswordValueById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const passwordsSlice = createSlice({
  name: "Passwords",
  initialState,
  reducers: {
    setSignOutPasswords: (state) => {
      state.passLoading     = false;
      state.error           = null;
      state.passwordsList   = [];
      state.passwordSelected = initialState.passwordSelected;
      state.newPassword      = initialState.newPassword;
      state.needUpdate       = initialState.needUpdate;
    },
    clearPasswordSelected: (state) => {
      state.passwordSelected = initialState.passwordSelected;
    },
    clearNewPassword: (state) => {
      state.newPassword = initialState.newPassword;
    },
    openNewPassword: (state) => {
      state.newPassword.open = true;
      state.newPassword.type = PasswordModalTypes.NEW;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPasswords.pending, (state) => {
        state.passLoading = true;
        state.error       = null;
      })
      .addCase(fetchPasswords.fulfilled, (state, action) => {
        state.passLoading  = false;
        state.needUpdate   = false;
        state.passwordsList = action.payload.passwordsList;
      })
      .addCase(fetchPasswords.rejected, (state, action) => {
        state.passLoading = false;
        state.error       = action.payload;
      })
      .addCase(fetchPasswordById.pending, (state) => {
        state.passLoading = true;
        state.error       = null;
      })
      .addCase(fetchPasswordById.fulfilled, (state, action) => {
        state.passLoading = false;
        if (action.payload.type === PasswordModalTypes.EDIT) {
          state.newPassword = action.payload;
        } else {
          state.passwordSelected = action.payload;
        }
      })
      .addCase(fetchPasswordById.rejected, (state, action) => {
        state.passLoading = false;
        state.error       = action.payload;
      })
      .addCase(fetchDeletePasswordById.pending, (state) => {
        state.passLoading              = true;
        state.error                    = null;
        state.passwordSelected.open    = false;
      })
      .addCase(fetchDeletePasswordById.fulfilled, (state) => {
        state.passLoading      = false;
        state.needUpdate       = true;
        state.passwordSelected = initialState.passwordSelected;
      })
      .addCase(fetchDeletePasswordById.rejected, (state, action) => {
        state.passLoading              = false;
        state.error                    = action.payload;
        state.passwordSelected.open    = true;
      });
  },
});

export const {
  setSignOutPasswords,
  clearPasswordSelected,
  clearNewPassword,
  openNewPassword,
} = passwordsSlice.actions;

export const selectPassLoading         = (state) => state.Passwords.passLoading;
export const selectPasswordsList       = (state) => state.Passwords.passwordsList;
export const selectIsPasswordsListEmpty = (state) => state.Passwords.passwordsList.length === 0;
export const selectPasswordSelected    = (state) => state.Passwords.passwordSelected;
export const selectNewPassword         = (state) => state.Passwords.newPassword;
export const selectNeedUpdate          = (state) => state.Passwords.needUpdate;

export default passwordsSlice.reducer;
EOF

# =============================================================================
# src/features/passwords/service/passwords.service.js
# =============================================================================
write_file "src/features/passwords/service/passwords.service.js" << 'EOF'
import axiosInstance from "../../../lib/axios/axiosInstance";
import apisEndPoints from "../../../shared/constants/apis";

export const getAllPaswords = async () => {
  const response = await axiosInstance.get(apisEndPoints.passwords.getAllPaswords);
  return response.data;
};

export const getPasswordValueById = async (id) => {
  const response = await axiosInstance.get(
    apisEndPoints.passwords.getValue.replace(":id", id)
  );
  return response.data;
};

export const createNewPassword = async (body) => {
  const response = await axiosInstance.post(apisEndPoints.passwords.createNew, body);
  return response.data;
};

export const deletePasswordValueById = async (id) => {
  const response = await axiosInstance.put(
    apisEndPoints.passwords.deleteValue.replace(":id", id)
  );
  return response.data;
};

export const updatePassword = async (id, body) => {
  const response = await axiosInstance.put(
    apisEndPoints.passwords.update.replace(":id", id),
    body
  );
  return response.data;
};
EOF

# =============================================================================
# src/features/passwords/Passwords.jsx
# =============================================================================
write_file "src/features/passwords/Passwords.jsx" << 'EOF'
import React, { useEffect, useCallback } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import { useIntl } from "react-intl";
import { Stack } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

import ViewTemplate from "../../shared/components/ui/ViewTemplate";
import PasswordsTable from "./components/PasswordsTable";
import ViewPassModal from "./components/ViewPassModal";
import NewPassModal from "./components/NewPassModal";
import CustomIconButton from "../../shared/components/ui/CustomIconButton";
import {
  fetchPasswords,
  selectPasswordsList,
  selectIsPasswordsListEmpty,
  fetchPasswordById,
  openNewPassword,
  selectNeedUpdate,
} from "./store/passwords.slice";
import { selectIsLogged } from "../auth/store/auth.slice";

const Passwords = () => {
  const intl     = useIntl();
  const dispatch = useDispatch();

  const PASSWORD_LIST = useSelector(selectPasswordsList);
  const IS_EMPTY_LIST = useSelector(selectIsPasswordsListEmpty);
  const IS_LOGGED     = useSelector(selectIsLogged);
  const NEED_UPDATE   = useSelector(selectNeedUpdate);

  const handleFetchPasswords = useCallback(
    (refresh = false) => { dispatch(fetchPasswords({ refresh })); },
    [dispatch]
  );

  const handleSeePassword = (row, type) => {
    dispatch(fetchPasswordById({ id: row.id, name: row.name, description: row.description, type }));
  };

  useEffect(() => {
    const shouldFetch = (IS_EMPTY_LIST && IS_LOGGED) || NEED_UPDATE;
    if (shouldFetch) handleFetchPasswords(NEED_UPDATE);
  }, [handleFetchPasswords, IS_EMPTY_LIST, IS_LOGGED, NEED_UPDATE]);

  return (
    <ViewTemplate viewTitle={intl.formatMessage({ id: "passwordTitle" })}>
      <ViewPassModal />
      <NewPassModal handleFetchPasswords={handleFetchPasswords} />

      <Stack direction="row" spacing={2}>
        <CustomIconButton
          onClick={(e) => { e.preventDefault(); handleFetchPasswords(true); }}
          icon={<RefreshIcon fontSize="small" />}
        />
        <CustomIconButton
          onClick={(e) => { e.preventDefault(); dispatch(openNewPassword()); }}
          icon={<AddIcon fontSize="small" />}
        />
      </Stack>

      <PasswordsTable rows={PASSWORD_LIST} handleSeePassword={handleSeePassword} />
    </ViewTemplate>
  );
};

export default Passwords;
EOF

# =============================================================================
# src/features/passwords/components/NewPassModal.jsx
# =============================================================================
write_file "src/features/passwords/components/NewPassModal.jsx" << 'EOF'
import React, { useState, useMemo } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Typography, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { createNewPassword, updatePassword } from "../service/passwords.service";
import { createNewPasswordBody } from "../../../shared/utils/request.utils";
import { selectNewPassword, clearNewPassword } from "../store/passwords.slice";
import { PasswordModalTypes } from "../../../shared/constants/enums";
import { TOAST_MESSAGES } from "../../../shared/constants/toastMessages";
import CustomIconButton from "../../../shared/components/ui/CustomIconButton";
import ReusableModal from "../../../shared/components/ui/ReusableModal";
import FormField from "../../../shared/components/inputs/FormField";
import PasswordField from "../../../shared/components/inputs/PasswordField";
import useToast from "../../../hooks/useToast";

const NewPassModal = ({ handleFetchPasswords }) => {
  const intl     = useIntl();
  const dispatch = useDispatch();
  const { toastError } = useToast();

  const NEW_PASSWORD = useSelector(selectNewPassword);

  const [showPassword, setShowPassword]             = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading]                       = useState(false);

  const isEdit = NEW_PASSWORD.open && NEW_PASSWORD.type === PasswordModalTypes.EDIT;

  const initialValues = useMemo(
    () =>
      isEdit
        ? {
            name:           NEW_PASSWORD.name || "",
            description:    NEW_PASSWORD.description || "",
            password:       NEW_PASSWORD.pswdDecrypted,
            repeatPassword: NEW_PASSWORD.pswdDecrypted,
          }
        : { name: "", description: "", password: "", repeatPassword: "" },
    [isEdit, NEW_PASSWORD]
  );

  const validationSchema = Yup.object({
    name:        Yup.string().required(intl.formatMessage({ id: "FieldRequired" })),
    description: Yup.string().required(intl.formatMessage({ id: "FieldRequired" })),
    password:    Yup.string().required(intl.formatMessage({ id: "FieldRequired" })),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], intl.formatMessage({ id: "PasswordsMustMatch" }))
      .required(intl.formatMessage({ id: "FieldRequired" })),
  });

  const handleCloseModal = () => {
    if (!loading) dispatch(clearNewPassword());
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (isEdit) {
        const noChanges =
          values.name        === NEW_PASSWORD.name &&
          values.description === NEW_PASSWORD.description &&
          values.password    === NEW_PASSWORD.pswdDecrypted;

        if (noChanges) {
          toastError(TOAST_MESSAGES.passwords.noChanges);
          setLoading(false);
          return;
        }
        await updatePassword(NEW_PASSWORD.id, createNewPasswordBody(values));
      } else {
        await createNewPassword(createNewPasswordBody(values));
      }
      handleFetchPasswords(true);
      dispatch(clearNewPassword());
    } catch (error) {
      toastError(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReusableModal open={NEW_PASSWORD.open} onClose={handleCloseModal}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Typography variant="h6" component="h2">
          <strong>{intl.formatMessage({ id: "NewPassModalTitle" })}</strong>
        </Typography>
        <CustomIconButton onClick={handleCloseModal} icon={<CloseIcon fontSize="small" />} />
      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched }) => (
          <Form>
            <FormField
              name="name"
              label={intl.formatMessage({ id: "Name" })}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />
            <PasswordField
              name="password"
              label={intl.formatMessage({ id: "Password" })}
              showPassword={showPassword}
              togglePasswordVisibility={() => setShowPassword((p) => !p)}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />
            <PasswordField
              name="repeatPassword"
              label={intl.formatMessage({ id: "RepeatPassword" })}
              showPassword={showRepeatPassword}
              togglePasswordVisibility={() => setShowRepeatPassword((p) => !p)}
              error={touched.repeatPassword && Boolean(errors.repeatPassword)}
              helperText={touched.repeatPassword && errors.repeatPassword}
            />
            <FormField
              name="description"
              label={intl.formatMessage({ id: "Description" })}
              error={touched.description && Boolean(errors.description)}
              helperText={touched.description && errors.description}
              rows={6}
            />
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button loading={loading} type="submit" variant="contained" color="primary">
                {intl.formatMessage({ id: "Submit" })}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </ReusableModal>
  );
};

export default NewPassModal;
EOF

# =============================================================================
# src/features/passwords/components/ViewPassModal.jsx
# =============================================================================
write_file "src/features/passwords/components/ViewPassModal.jsx" << 'EOF'
import React from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";

import {
  selectPasswordSelected,
  clearPasswordSelected,
  fetchDeletePasswordById,
} from "../store/passwords.slice";
import { PasswordModalTypes } from "../../../shared/constants/enums";
import { TOAST_MESSAGES } from "../../../shared/constants/toastMessages";
import CustomIconButton from "../../../shared/components/ui/CustomIconButton";
import ReusableModal from "../../../shared/components/ui/ReusableModal";
import useToast from "../../../hooks/useToast";

const ViewPassModal = () => {
  const intl     = useIntl();
  const dispatch = useDispatch();
  const { toastSuccess, toastError } = useToast();

  const PASSWORD_SELECTED = useSelector(selectPasswordSelected);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(PASSWORD_SELECTED.pswdDecrypted);
      toastSuccess(TOAST_MESSAGES.auth.copySuccess);
    } catch {
      toastError(TOAST_MESSAGES.auth.copyError);
    }
  };

  const handleDeletePassword = (e) => {
    e.preventDefault();
    dispatch(fetchDeletePasswordById({ id: PASSWORD_SELECTED.id }));
  };

  return (
    <ReusableModal open={PASSWORD_SELECTED.open} onClose={() => dispatch(clearPasswordSelected())}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Typography variant="h6" component="h2">
          <strong>{intl.formatMessage({ id: "ViewPassModalTitle" })}</strong>{" "}
          {PASSWORD_SELECTED.name}
        </Typography>
        <CustomIconButton
          onClick={() => dispatch(clearPasswordSelected())}
          icon={<CloseIcon fontSize="small" />}
        />
      </Box>

      <TabContext value={PASSWORD_SELECTED.type}>
        <TabPanel value={PasswordModalTypes.SEE} sx={{ p: 0 }}>
          <Box display="flex" alignItems="center" gap="10px" sx={{ mt: 2 }}>
            <Typography>
              <strong>{intl.formatMessage({ id: "ViewPassModalValue" })}</strong>{" "}
              {PASSWORD_SELECTED.pswdDecrypted}
            </Typography>
            <CustomIconButton
              onClick={handleCopyToClipboard}
              icon={<ContentCopyIcon fontSize="small" />}
            />
          </Box>
          <Typography sx={{ mt: 2 }}>
            <strong>{intl.formatMessage({ id: "ViewPassModalDescription" })}</strong>{" "}
            {PASSWORD_SELECTED.description}
          </Typography>
        </TabPanel>

        <TabPanel value={PasswordModalTypes.DELETE} sx={{ p: 0 }}>
          <Typography sx={{ mt: 2 }}>
            <strong>{intl.formatMessage({ id: "deletePasswordMessage" })}</strong>
          </Typography>
          <Stack direction="row-reverse" sx={{ p: 1, gap: 2 }}>
            <Button onClick={handleDeletePassword} variant="contained" color="success">
              {intl.formatMessage({ id: "Save" })}
            </Button>
            <Button onClick={() => dispatch(clearPasswordSelected())} variant="contained" color="error">
              {intl.formatMessage({ id: "Cancel" })}
            </Button>
          </Stack>
        </TabPanel>
      </TabContext>
    </ReusableModal>
  );
};

export default ViewPassModal;
EOF

# =============================================================================
# src/features/passwords/components/PasswordsTable.jsx
# =============================================================================
write_file "src/features/passwords/components/PasswordsTable.jsx" << 'EOF'
import React from "react";
import PropTypes from "prop-types";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import {
  Box, Table, TableBody, TableCell, TableContainer, TableFooter,
  TablePagination, TableRow, TableHead, Paper, IconButton, Typography,
} from "@mui/material";
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft, KeyboardArrowRight,
  LastPage as LastPageIcon,
} from "@mui/icons-material";
import { useIntl } from "react-intl";

import BlueButton from "../../../shared/components/ui/BlueButton";
import CustomIconButton from "../../../shared/components/ui/CustomIconButton";
import { PasswordModalTypes } from "../../../shared/constants/enums";

const TablePaginationActions = ({ count, page, rowsPerPage, onPageChange }) => {
  const theme = useTheme();

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={(e) => onPageChange(e, 0)} disabled={page === 0}>
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={(e) => onPageChange(e, page - 1)} disabled={page === 0}>
        {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, page + 1)}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1))}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
};

TablePaginationActions.propTypes = {
  count:        PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page:         PropTypes.number.isRequired,
  rowsPerPage:  PropTypes.number.isRequired,
};

const PasswordsTable = ({ rows, handleSeePassword }) => {
  const intl = useIntl();

  const [page, setPage]               = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);

  const columns = [
    { label: intl.formatMessage({ id: "TableHeadName" }) },
    { label: intl.formatMessage({ id: "TableHeadDescription" }) },
    { label: intl.formatMessage({ id: "TableHeadPassword" }) },
    { label: intl.formatMessage({ id: "TableHeadPassActions" }) },
  ];

  const emptyRows = React.useMemo(
    () => (page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0),
    [page, rowsPerPage, rows.length]
  );

  const visibleRows = React.useMemo(
    () =>
      rowsPerPage > 0
        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : rows,
    [rows, page, rowsPerPage]
  );

  return (
    <TableContainer component={Paper}>
      <Table aria-label="passwords table">
        <TableHead>
          <TableRow>
            {columns.map((col, idx) => (
              <TableCell key={idx} align="left">{col.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {visibleRows.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell component="th" scope="row">
                <Typography>{row.name}</Typography>
              </TableCell>
              <TableCell align="left">
                <Typography>{row.description}</Typography>
              </TableCell>
              <TableCell align="left">
                <BlueButton
                  text="Ver contraseña"
                  handleClick={(e) => { e.preventDefault(); handleSeePassword(row, PasswordModalTypes.SEE); }}
                />
              </TableCell>
              <TableCell align="left">
                <Box sx={{ display: "flex", gap: 1 }}>
                  <CustomIconButton
                    onClick={(e) => { e.preventDefault(); handleSeePassword(row, PasswordModalTypes.EDIT); }}
                    icon={<EditIcon fontSize="small" />}
                  />
                  <CustomIconButton
                    onClick={(e) => { e.preventDefault(); handleSeePassword(row, PasswordModalTypes.DELETE); }}
                    icon={<DeleteIcon fontSize="small" />}
                  />
                </Box>
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[30, 50, 100, { label: "Todos", value: -1 }]}
              colSpan={0}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{ select: { inputProps: { "aria-label": "rows per page" }, native: true } }}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default PasswordsTable;
EOF

# =============================================================================
# src/features/home/Home.jsx
# =============================================================================
log_section "features/home/"

write_file "src/features/home/Home.jsx" << 'EOF'
import React from "react";
import { CssBaseline, Divider, Box } from "@mui/material";

import AppTheme from "../../app/theme/AppTheme";
import Hero from "./components/Hero";
import Highlights from "./components/Highlights";

const Home = (props) => {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box>
        <Hero />
        <Divider />
        <Highlights />
        <Divider />
      </Box>
    </AppTheme>
  );
};

export default Home;
EOF

# Hero.jsx y Highlights.jsx no tienen imports de proyecto — ya fueron movidos.
log_ok "features/home/components/Hero.jsx       — sin cambios internos"
log_ok "features/home/components/Highlights.jsx — sin cambios internos"

# =============================================================================
# src/shared/components/AppBar/AppAppBar.jsx
# =============================================================================
log_section "shared/components/"

write_file "src/shared/components/AppBar/AppAppBar.jsx" << 'EOF'
import React from "react";
import {
  Box, AppBar, Toolbar, IconButton, Container,
  Divider, MenuItem, Drawer,
} from "@mui/material";
import { Menu as MenuIcon, CloseRounded as CloseRoundedIcon } from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";

import ColorModeIconDropdown from "../ui/ColorModeIconDropdown";
import Links from "../../constants/links";
import LinkButton from "../ui/LinkButton";
import UserPopover from "../ui/UserPopover";
import { selectIsLogged } from "../../../features/auth/store/auth.slice";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display:         "flex",
  alignItems:      "center",
  justifyContent:  "space-between",
  flexShrink:      0,
  borderRadius:    `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter:  "blur(24px)",
  border:          "1px solid",
  borderColor:     (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding:   "8px 12px",
}));

const AppAppBar = () => {
  const location = useLocation();
  const intl     = useIntl();
  const IS_LOGGED = useSelector(selectIsLogged);

  const isHome = location.pathname === Links.home;

  const routes = [
    { linkTo: Links.passwords, textId: "passwordsBtn", showWhenLogged: true },
    { linkTo: Links.signIn,    textId: "loginTitle",   showWhenLogged: false },
    { linkTo: Links.SignUp,    textId: "signUp",        showWhenLogged: true },
  ];

  const [open, setOpen] = React.useState(false);

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow:       0,
        bgcolor:         "transparent",
        backgroundImage: "none",
        mt:              "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}>
            {!isHome && (
              <LinkButton
                btnLinkTo={Links.home}
                btnText={intl.formatMessage({ id: "homeBtn" })}
                btnColor="primary"
                btnVariant="text"
                btnSize="small"
              />
            )}
            {IS_LOGGED && (
              <Box>
                {routes
                  .filter((r) => r.showWhenLogged)
                  .map((r, i) => (
                    <LinkButton
                      key={i}
                      btnLinkTo={r.linkTo}
                      btnText={intl.formatMessage({ id: r.textId })}
                      btnColor="primary"
                      btnVariant="text"
                      btnSize="small"
                    />
                  ))}
              </Box>
            )}
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
            {IS_LOGGED ? (
              <UserPopover />
            ) : (
              routes
                .filter((r) => !r.showWhenLogged)
                .map((r, i) => (
                  <LinkButton
                    key={i}
                    btnLinkTo={r.linkTo}
                    btnText={intl.formatMessage({ id: r.textId })}
                    btnColor="primary"
                    btnVariant="text"
                    btnSize="small"
                  />
                ))
            )}
            <ColorModeIconDropdown />
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={() => setOpen(true)}>
              <MenuIcon />
            </IconButton>

            <Drawer
              anchor="top"
              open={open}
              onClose={() => setOpen(false)}
              PaperProps={{ sx: { top: "var(--template-frame-height, 0px)" } }}
            >
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <IconButton onClick={() => setOpen(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <MenuItem component={Link} to={Links.home} onClick={() => setOpen(false)}>
                  {intl.formatMessage({ id: "homeBtn" })}
                </MenuItem>

                <Divider sx={{ my: 3 }} />

                {routes
                  .filter((r) => (IS_LOGGED ? r.showWhenLogged : !r.showWhenLogged))
                  .map((r, i) => (
                    <MenuItem
                      key={i}
                      component={Link}
                      to={r.linkTo}
                      onClick={() => setOpen(false)}
                    >
                      {intl.formatMessage({ id: r.textId })}
                    </MenuItem>
                  ))}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
};

export default AppAppBar;
EOF

# =============================================================================
# src/shared/components/ui/Loading.jsx
# =============================================================================
write_file "src/shared/components/ui/Loading.jsx" << 'EOF'
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { useSelector } from "react-redux";

import { selectApiLoading } from "../../../store/navigation.slice";

const Loading = () => {
  const OPEN = useSelector(selectApiLoading);
  return (
    <Backdrop open={OPEN} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
EOF

# =============================================================================
# src/shared/components/ui/ProtectedRoute.jsx
# =============================================================================
write_file "src/shared/components/ui/ProtectedRoute.jsx" << 'EOF'
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Links from "../../constants/links";
import { selectIsLogged } from "../../../features/auth/store/auth.slice";

const ProtectedRoute = () => {
  const navigate    = useNavigate();
  const USER_LOGGED = useSelector(selectIsLogged);

  useEffect(() => {
    if (!USER_LOGGED) navigate(Links.home);
  }, [USER_LOGGED, navigate]);

  return <Outlet />;
};

export default ProtectedRoute;
EOF

# =============================================================================
# src/shared/components/ui/SignInProtect.jsx
# =============================================================================
write_file "src/shared/components/ui/SignInProtect.jsx" << 'EOF'
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Links from "../../constants/links";
import { selectIsLogged } from "../../../features/auth/store/auth.slice";

const SignInProtect = () => {
  const navigate    = useNavigate();
  const USER_LOGGED = useSelector(selectIsLogged);

  useEffect(() => {
    if (USER_LOGGED) navigate(Links.home);
  }, [USER_LOGGED, navigate]);

  return <Outlet />;
};

export default SignInProtect;
EOF

# =============================================================================
# src/shared/components/ui/TokenExpirationChecker.jsx
# =============================================================================
write_file "src/shared/components/ui/TokenExpirationChecker.jsx" << 'EOF'
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Links from "../../constants/links";
import { putSignOut } from "../../../features/auth/service/auth.service";
import { selectTokenExpTime, setSignOutUser } from "../../../features/auth/store/auth.slice";
import { setSignOutPasswords } from "../../../features/passwords/store/passwords.slice";
import { TOAST_MESSAGES } from "../../constants/toastMessages";
import useToast from "../../../hooks/useToast";

const TokenExpirationChecker = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toastError } = useToast();

  const TOKEN_EXP_TIME = useSelector(selectTokenExpTime);

  useEffect(() => {
    const handleExpiration = async () => {
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime >= TOKEN_EXP_TIME) {
        try {
          await putSignOut();
          dispatch(setSignOutUser());
          dispatch(setSignOutPasswords());
          toastError(TOAST_MESSAGES.auth.sessionExpired);
          navigate(Links.signIn);
        } catch {
          toastError(TOAST_MESSAGES.generic.unexpectedError);
        }
      }
    };

    handleExpiration();
    const intervalId = setInterval(handleExpiration, 60000);
    return () => clearInterval(intervalId);
  }, [TOKEN_EXP_TIME, dispatch, navigate, toastError]);

  return null;
};

export default TokenExpirationChecker;
EOF

# =============================================================================
# src/shared/components/ui/UserPopover.jsx
# =============================================================================
write_file "src/shared/components/ui/UserPopover.jsx" << 'EOF'
import React, { useState } from "react";
import { Box, Button, Popover } from "@mui/material";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSelector, useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

import { selectNameUser, setSignOutUser } from "../../../features/auth/store/auth.slice";
import { setSignOutPasswords } from "../../../features/passwords/store/passwords.slice";
import { putSignOut } from "../../../features/auth/service/auth.service";
import Links from "../../constants/links";
import useToast from "../../../hooks/useToast";
import { TOAST_MESSAGES } from "../../constants/toastMessages";

const UserPopover = () => {
  const intl     = useIntl();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toastError } = useToast();

  const NAME_USER  = useSelector(selectNameUser);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async (e, closePopover) => {
    e.preventDefault();
    setIsLoading(true);
    closePopover();
    try {
      await putSignOut();
      navigate(Links.home);
      dispatch(setSignOutPasswords());
      dispatch(setSignOutUser());
    } catch {
      toastError(TOAST_MESSAGES.auth.signOutError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PopupState variant="popover" popupId="user-popover">
      {(popupState) => (
        <Box>
          <Button color="primary" variant="text" loading={isLoading} {...bindTrigger(popupState)}>
            {NAME_USER}
          </Button>
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top",    horizontal: "center" }}
            sx={{ padding: 2 }}
          >
            <Button
              color="primary"
              onClick={(e) => handleSignOut(e, popupState.close)}
              sx={{ padding: 1, display: "flex", gap: 1 }}
            >
              <LogoutIcon /> {intl.formatMessage({ id: "signOutBtn" })}
            </Button>
          </Popover>
        </Box>
      )}
    </PopupState>
  );
};

export default UserPopover;
EOF

# =============================================================================
# src/shared/components/ui/ViewTemplate.jsx
# =============================================================================
write_file "src/shared/components/ui/ViewTemplate.jsx" << 'EOF'
import React from "react";
import { styled } from "@mui/material/styles";
import { CssBaseline, Stack, Container, Typography } from "@mui/material";

import AppTheme from "../../../app/theme/AppTheme";

const StackStyled = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  position: "relative",
  minHeight: "100%",
  [theme.breakpoints.up("sm")]: { padding: theme.spacing(4) },
  "&::before": {
    content:         '""',
    display:         "block",
    position:        "absolute",
    zIndex:          -1,
    inset:           0,
    backgroundImage: "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    backgroundSize:   "cover",
    ...theme.applyStyles("dark", {
      backgroundImage: "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

const ContainerStyled = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(10),
  display:   "flex",
  flexDirection:  "column",
  alignContent:   "center",
  justifyContent: "center",
  gap: 6,
  [theme.breakpoints.down("sm")]: { marginTop: theme.spacing(12), gap: 1 },
}));

const ViewTemplate = ({ children, maxWidth, viewTitle }) => {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <StackStyled>
        <ContainerStyled maxWidth={maxWidth ? "xl" : maxWidth}>
          <Typography variant="h5">{viewTitle}</Typography>
          {children}
        </ContainerStyled>
      </StackStyled>
    </AppTheme>
  );
};

export default ViewTemplate;
EOF

# =============================================================================
# src/lib/axios/axiosInstance.js
# =============================================================================
log_section "lib/"

write_file "src/lib/axios/axiosInstance.js" << 'EOF'
import axios from "axios";

const pendingRequests = new Map();

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

const getRequestKey = (config) => `${config.method}-${config.url}`;

axiosInstance.interceptors.request.use((config) => {
  const requestKey  = getRequestKey(config);
  const controller  = pendingRequests.get(requestKey);
  if (controller) controller.abort();

  const newController = new AbortController();
  config.signal = newController.signal;
  pendingRequests.set(requestKey, newController);
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    pendingRequests.delete(getRequestKey(response.config));
    return response;
  },
  (error) => {
    if (error.name === "CanceledError") return Promise.reject(error);
    if (error.config) pendingRequests.delete(getRequestKey(error.config));
    return Promise.reject(error);
  }
);

export default axiosInstance;
EOF

# =============================================================================
# RESUMEN FINAL
# =============================================================================
echo ""
echo -e "${GREEN}"
echo "  ╔════════════════════════════════════════════════════════╗"
echo "  ║   Imports actualizados correctamente                   ║"
echo "  ╠════════════════════════════════════════════════════════╣"
echo "  ║                                                        ║"
echo "  ║   Archivos escritos:                                   ║"
echo "  ║   • src/main.jsx                                       ║"
echo "  ║   • src/app/router.jsx + store.js + theme/             ║"
echo "  ║   • src/store/ (navigation, middleware, index)         ║"
echo "  ║   • src/hooks/useToast.js                              ║"
echo "  ║   • src/features/auth/ (slice, service, views)         ║"
echo "  ║   • src/features/passwords/ (slice, service, views)    ║"
echo "  ║   • src/features/home/                                 ║"
echo "  ║   • src/shared/ (AppBar, ui, inputs, constants)        ║"
echo "  ║   • src/lib/axios/axiosInstance.js                     ║"
echo "  ║                                                        ║"
echo "  ║   Archivos SIN cambios internos (solo movidos):        ║"
echo "  ║   • CustomCard, BlueButton, LinkButton,                ║"
echo "  ║     ColorModeIconDropdown, ReusableModal,              ║"
echo "  ║     CustomIconButton, FormField, PasswordField,        ║"
echo "  ║     SitemarkIcon, Hero, Highlights,                    ║"
echo "  ║     links.js, enums.js, apis.js,                       ║"
echo "  ║     request.utils.js, es.json                          ║"
echo "  ║                                                        ║"
echo "  ║   PRÓXIMO PASO:                                        ║"
echo "  ║     yarn dev  →  verificar que compila                 ║"
echo "  ║                                                        ║"
echo "  ╚════════════════════════════════════════════════════════╝"
echo -e "${NC}"
EOF