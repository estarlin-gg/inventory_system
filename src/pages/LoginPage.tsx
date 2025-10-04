import { Button, HelperText, Label, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { LoginCredentials, loginCredentialsSchema } from "../models/auth";
import { useAuth } from "../hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

export const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginCredentialsSchema),
  });
  const { login } = useAuth();

  const OnSubmit = (data: LoginCredentials) => {
    try {
      login(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col gap-8 border border-gray-300 rounded-xl p-8 shadow-2xl">
        <h2 className="text-4xl text-center">Iniciar sesion</h2>
        <form
          onSubmit={handleSubmit(OnSubmit)}
          className="flex w-md flex-col gap-4"
        >
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email1">Correo electronico</Label>
            </div>
            <TextInput
              id="email1"
              type="email"
              color={errors.email ? "failure" : "gray"}
              placeholder="example@example.com"
              {...register("email")}
            />
            <HelperText>
              {errors.email && <span>{errors.email.message}</span>}
            </HelperText>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password1">Contrase;a</Label>
            </div>
            <TextInput
              id="password1"
              type="password"
              color={errors.password ? "failure" : "gray"}
              {...register("password")}
            />
            <HelperText>
              {errors.password && <span>{errors.password.message}</span>}
            </HelperText>
          </div>
          <div className="">
            <span>
              No tienes cuenta?{" "}
              <Link to={"/register"}>
                <span className="text-blue-600">registrate</span>
              </Link>
            </span>
          </div>

          <Button type="submit">Iniciar</Button>
        </form>
      </div>
    </section>
  );
};
