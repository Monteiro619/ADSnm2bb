import { useForm } from "react-hook-form";
import InputEmail from "../components/InputEmail";
import InputSenha from "../components/InputSenha.";


function Formulario(props) {
    const { register, handleSubmit, formState: { errors }, } = useForm();
    return (
        <form onSubmit={handleSubmit(props.onEnviar)}>
            <InputEmail register={register} error={errors.email} />
            <InputSenha register={register} error={errors.senha} />
            <button type="submit">{props.texto}</button>
        </form>
    )
}

export default Formulario;