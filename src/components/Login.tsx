import { type FormEvent, useRef } from "react";
import { Button } from "~/components/UI/Button";
import { api } from "~/utils/api";

const Login = () => {
  const apiUtils = api.useContext();
  const { mutate, error } = api.admin.login.useMutation({
    onSuccess: (token) => {
      sessionStorage.setItem("sadfrogs_admin", token);
      void apiUtils.studySpots.getAllPendingEdits.invalidate();
    },
  });

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const submit = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !password) return;

    mutate({ username, password });
  };

  const errorColor = error ? "bg-red-500" : "bg-gray-200";
  const errorColorInput = error ? "bg-red-300" : "";

  return (
    <div className="font-mono ">
      <form className={`${errorColor} p-4 rounded-md flex flex-col gap-4 w-64`}>
        <div>sadfrog</div>
        <input
          className={`px-2 ${errorColorInput}`}
          type="text"
          ref={usernameRef}
          placeholder="user"
          autoComplete="username"
        />
        <input
          className={`px-2 ${errorColorInput}`}
          type="password"
          ref={passwordRef}
          placeholder="pass"
          autoComplete="current-password"
        />
        <Button
          variant="secondary"
          onClick={submit}
          className={`${errorColorInput}`}
        >
          login
        </Button>
      </form>
    </div>
  );
};
export default Login;
