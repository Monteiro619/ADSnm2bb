function InputEmail(props) {
    return (
        <>
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" name="email" value={props.valor} onChange={(e) => props.mudaValor(e.target.value)} required />
        </>
    );
}

export default InputEmail;