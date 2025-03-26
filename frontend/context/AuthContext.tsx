import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import ErrorModal from "../components/ErrorModal";
import { jwtDecode } from "jwt-decode";
import Toast from "../components/Toast";

interface AuthContextTypes {
  user: any;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: any) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  visible: boolean;
  message: string;
  setVisible: (state:boolean) => void;
  setToastVisible: (state:boolean) => void;
  setMessage: (msg:string) => void;
  showError:(msg:string) => void;
  isLoading:boolean;
  setIsLoading:(state:boolean)=>void;
}

const AuthContext = createContext<AuthContextTypes>({
  user: null,
  accessToken: null,
  refreshToken: null,
  setUser: () => {},
  setAccessToken: () => {},
  setRefreshToken: () => {},
  setVisible: () => {},
  setToastVisible: () => {},
  setMessage: () => {},
  showError: () => {},
  setIsLoading:()=>{},
  visible: false,
  message: "",
  isLoading:false,

});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const showError = (message: string) => {
    setMessage(message);
    setVisible(true);
  };

  useEffect(() => {
    getFromStorage();
  }, []);

  const isTokenExpired = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };
  const getFromStorage = async () => {
    const storedUser = await AsyncStorage.getItem("user");
    const storedAccessToken = await AsyncStorage.getItem("accessToken");
    const storedRefreshToken = await AsyncStorage.getItem("refreshToken");
    
    if (storedUser && storedAccessToken && storedRefreshToken ) {
      if(isTokenExpired(storedAccessToken)){
            await AsyncStorage.clear();
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
      } else {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
      }
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        refreshToken,
        setRefreshToken,
        accessToken,
        setAccessToken,
        visible,
        setVisible,
        message,
        setMessage,
        showError,
        setIsLoading,
        isLoading,
        setToastVisible
      }}
    >
      {children}
      <ErrorModal visible={visible} message={message} onClose={() => setVisible(false)} />
      <Toast
        message={message}
        visible={toastVisible}
        onDismiss={() => setToastVisible(false)}
        isLoading={isLoading}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
