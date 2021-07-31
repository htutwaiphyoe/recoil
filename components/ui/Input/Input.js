const Input = (props) => {
    let input = null;
    switch (props.inputType) {
        default:
            input = <input {...props.inputConfig} />;
    }
};
