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
    <section className="w-screen h-screen flex justify-center items-center bg-gray-100 p-2  text-black  dark:bg-gray-900 dark:text-gray-100">
      <div className="w-sm  flex flex-col gap-8 border border-gray-700 rounded-xl p-4 md:w-md lg:p-8  shadow-2xl dark:bg-gray-800">
        <h2 className="text-3xl lg:text-4xl text-center font-semibold text-white">
          Iniciar sesión
        </h2>

        <form
          onSubmit={handleSubmit(OnSubmit)}
          className="flex  flex-col gap-4"
        >
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email1" className="text-black  dark:text-gray-200">
                Correo electrónico
              </Label>
            </div>
            <TextInput
              id="email1"
              type="email"
              color={errors.email ? "failure" : "gray"}
              placeholder="example@example.com"
              {...register("email")}
            />
            <HelperText >
              {errors.email && <span className="text-red-400">{errors.email.message}</span>}
            </HelperText>
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="password1" className="text-gray-200">
                Contraseña
              </Label>
            </div>
            <TextInput
              id="password1"
              type="password"
              placeholder="******"
              color={errors.password ? "failure" : "gray"}
              {...register("password")}
            />
            <HelperText >
              {errors.password && <span className="text-red-400">{errors.password.message}</span>}
            </HelperText>
          </div>

          {/* Link de registro */}
          <div className="text-sm text-gray-300">
            <span>
              ¿No tienes cuenta?{" "}
              <Link to={"/register"}>
                <span className="text-blue-400 hover:text-blue-300 font-medium">
                  Regístrate
                </span>
              </Link>
            </span>
          </div>

          {/* Botón */}
          <Button
            type="submit"
            color="blue"
            className="bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-800"
          >
            Iniciar sesión
          </Button>
        </form>
      </div>
    </section>
  );
};
