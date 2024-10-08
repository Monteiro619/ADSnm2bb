import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import InputEmail from "../components/InputEmail";
import InputSenha from "../components/InputSenha";
import Botao from "../components/Botao";


function FormLogin() {
    const {register, handleSubmit, formState: {errors}} = useForm();
    const navigate = useNavigate();
    const onSubmit = (data) => {
        console.log(data);
        navigate("/home");
      }


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <InputEmail register={register} error={errors.email} />
            <InputSenha register={register} error={errors.senha} />
            <Botao texto="Entrar" />

        </form>
    );
  }

  export default FormLogin;