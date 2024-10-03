function InputEmail(props) {
    const regras = {
      required: { value: true, message: "Email é obrigatorio" },
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Formato de email invalido ",
      },
    };
    return (
      <>
        <label htmlFor="email">Email</label>
        <input type="email" {...props.register("email", regras)} />
        {props.error && <p>{props.error.message}</p>}
      </>
    );
  }
  
  export default InputEmail;