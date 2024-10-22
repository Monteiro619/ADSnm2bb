function InputTelefone(props) {

    const regras = {
        required: "Telefone é obrigatorio", 
    };

    return(
        <>
            <label htmlFor="telefone">Telefone</label>
            <input type="tel" {...props.register("telefone", regras)} />
            {props.error && <p>{props.error.message}</p>}
        </>
    );
}

export default InputTelefone;