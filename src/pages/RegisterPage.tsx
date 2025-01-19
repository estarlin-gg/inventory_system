import { Link } from "react-router-dom";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useForm } from "react-hook-form";
import { IUserCredentials } from "../model";
import { useAuth } from "../hooks/useAuth";
export const RegisterPage = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IUserCredentials>();
  
  const { Register } = useAuth();

  const OnSubmit = async (data: IUserCredentials) => {
    console.log(data);
    try {
      Register(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex items-center w-screen h-screen justify-center p-5">
      <form
        onSubmit={handleSubmit(OnSubmit)}
        className=" border p-4 rounded-lg flex flex-col  w-full gap-4 max-w-96"
      >
        <h2 className="text-2xl text-center">Registrate</h2>
        <div className="space-y-2 w-full">
          <label htmlFor="">Correo electronico</label>
          <Input
            type="email"
            className="border-2 input-bordered"
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                message: "El correo debe ser una dirección válida de Gmail",
              },
            })}
          />
          {errors.email && <p className="text-error">{errors.email.message}</p>}
        </div>
        <div className="space-y-2 w-full">
          <label htmlFor="">Contrase;a</label>
          <Input
            type="password"
            className="border-2 input-bordered"
            {...register("password", {
              required: "La contrase;a es obligatoria",
              minLength: {
                value: 6,
                message: "La contrase;a debe de tener minimo 6 caracteres",
              },
            })}
          />
          {errors.password && (
            <p className="text-error">{errors.password.message}</p>
          )}
        </div>

        <div className="">
          <span>
            Ya tienes cuenta?{" "}
            <Link to={"/login"} className="text-blue-600 underline">
              inicia sesion
            </Link>
          </span>
        </div>
        <div className="">
          <Button className="btn-primary w-full" label="registrar" />
        </div>
      </form>
    </div>
  );
};
