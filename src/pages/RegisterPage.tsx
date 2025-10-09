import { Button, HelperText, Label, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { Credentials, credentialsSchema } from "../models/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useStore } from "../store/store";

export const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Credentials>({ resolver: zodResolver(credentialsSchema) });

  const re = useStore((state) => state.register);

  const OnSubmit = (data: Credentials) => {
    try {
      re(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="w-screen h-screen flex justify-center items-center p-2 bg-gray-900 text-gray-100">
      <div className="w-sm  flex flex-col gap-8 border border-gray-700 rounded-xl p-4 md:w-md lg:p-8  shadow-2xl dark:bg-gray-800">
        <h2 className="text-3xl lg:text-4xl text-center font-semibold text-white">
          Regístrate
        </h2>
        <form
          onSubmit={handleSubmit(OnSubmit)}
          className="flex  flex-col gap-4"
        >
          <div>
            <div className="mb-2 block">
              <Label htmlFor="userName" className="text-gray-200">
                Nombre
              </Label>
            </div>
            <TextInput
              id="userName"
              type="text"
              color={errors.userName ? "failure" : "gray"}
              placeholder="Escribe tu nombre"
              {...register("userName")}
            />
            <HelperText>
              {errors.userName && (
                <span className="text-red-400">{errors.userName.message}</span>
              )}
            </HelperText>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email1" className="text-gray-200">
                Correo electrónico
              </Label>
            </div>
            <TextInput
              id="email1"
              type="email"
              placeholder="example@example.com"
              color={errors.email ? "failure" : "gray"}
              {...register("email")}
            />
            <HelperText className="text-red-400">
              {errors.email && (
                <span className="text-red-400">{errors.email.message}</span>
              )}
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
            <HelperText className="text-red-400">
              {errors.password && (
                <span className="text-red-400">{errors.password.message}</span>
              )}
            </HelperText>
          </div>

          <div className="text-sm text-gray-300">
            <span>
              ¿Ya tienes cuenta?{" "}
              <Link to={"/login"}>
                <span className="text-blue-400 hover:text-blue-300 font-medium">
                  Inicia sesión
                </span>
              </Link>
            </span>
          </div>

          <Button
            type="submit"
            color="blue"
            className="bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-800"
          >
            Registrar
          </Button>
        </form>
      </div>
    </section>
  );
};
