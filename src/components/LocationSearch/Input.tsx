import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const tokenName = "sad-frogs-session-token";

const LocationSearchInput: React.FC = () => {
  const [token, setToken] = useState<{
    value: string;
    expiry: number;
  } | null>(null);

  // Load token from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem(tokenName);

    if (storedToken) {
      const parsedToken = JSON.parse(storedToken);

      if (parsedToken.expiry < new Date().getTime()) {
        removeToken();
        createToken();
      }

      setToken(JSON.parse(storedToken));
    }
  }, []);

  const createToken = () => {
    const item = {
      value: uuidv4(),
      expiry: new Date().getTime() + 3600000, // 1 hour
    };

    localStorage.setItem(tokenName, JSON.stringify(item));
    setToken(item);
  };

  const removeToken = () => {
    localStorage.removeItem(tokenName);
    setToken(null);
  };

  return (
    <div>
      {token ? (
        <div>
          <button onClick={removeToken}>Logout</button>
          <p>Token exists!</p>
          <p>token: {token.value}</p>
          <p>expiry: {token.expiry}</p>
        </div>
      ) : (
        <div>
          <button onClick={createToken}>Login</button>
          <p>Token doesn't exist!</p>
        </div>
      )}
    </div>
  );
};

export default LocationSearchInput;
