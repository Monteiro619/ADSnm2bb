import { useForm } from 'react-hook-form';
import InputNome from '../componentes/InputNome';
import InputTelefone from '../componentes/InputTelefone';

function Formulario (props) {
    const { register, handleSubmit, formState: { errors }, } = useForm({values: props.dados });
    
    return (
        <form onSubmit={handleSubmit(props.trataEnviar)}>
            <InputNome register={register} error={errors.nome} />
            <InputTelefone register={register} error={errors.telefone} />
            <button type="submit">Salvar</button>
        </form>
    );
}

export default Formulario;