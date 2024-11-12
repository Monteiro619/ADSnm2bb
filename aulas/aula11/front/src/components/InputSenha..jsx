function InputSenha (props) {
    const regras = {
        requirede: "Senha é obrigatório",
        pattern: {
            value: 6,
            message: "Senha deve ter pelo menos 6 caracteres",
        },
    };

    return (
        <>
        <label htmlFor="Senha">E-mail:</label>
        <input type="password" {...props.register("senha", regras)} />
        {props.error && <p>{props.error.message}</p>}
        </>
    );
}

export default InputSenha;