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
    console.log(data);

    try {
      re(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="w-screen h-screen flex justify-center items-center">

      <div className="flex flex-col gap-8 border border-gray-300 rounded-xl p-8 shadow-2xl">
        <h2 className="text-4xl text-center">Registrate</h2>
        <form
          onSubmit={handleSubmit(OnSubmit)}
          className="flex w-md flex-col gap-4"
        >
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email1">Nombre </Label>
            </div>
            <TextInput
              id="userName"
              type="text"
              color={errors.userName ? "failure" : "gray"}
              placeholder="example@example.com"
              {...register("userName")}
            />
            <HelperText>
              {errors.userName && <span>{errors.userName.message}</span>}
            </HelperText>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email1">Correo electronico</Label>
            </div>
            <TextInput
              id="email1"
              type="email"
              placeholder="example@example.com"
              color={errors.email ? "failure" : "gray"}
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
              placeholder="******"
              color={errors.password ? "failure" : "gray"}
              {...register("password")}
            />
            <HelperText>
              {errors.password && <span>{errors.password.message}</span>}
            </HelperText>
          </div>
          <div className="">
            <span>
              Ya tienes cuenta?
              <Link to={"/login"}>
                <span className="text-blue-600">inicia sesion</span>
              </Link>
            </span>
          </div>
          <Button type="submit">Registrar</Button>
        </form>
      </div>
    </section>
  );
};
