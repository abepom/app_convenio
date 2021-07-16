export default mask = (text, set, setTeclado) => {
  let type = ['default', 'numeric'];
  let texto = text;
  text = text.replace(/[.]/g, '').replace('/', '').replace('-', '');

  if (isNaN(text.substr(0, 1)) || text == '') {
    setTeclado(type[0]);
  } else {
    setTeclado(type[1]);

    switch (text.length) {
      case 3:
        text = `${text.substr(0, 3)}`;
        break;
      case 4:
        text = `${text.substr(0, 3)}.${text.substr(3, 1)}`;
        break;
      case 6:
        text = `${text.substr(0, 3)}.${text.substr(3, 3)}`;
        break;
      case 7:
        text = `${text.substr(0, 3)}.${text.substr(3, 3)}.${text.substr(6, 1)}`;
        break;
      case 9:
        text = `${text.substr(0, 3)}.${text.substr(3, 3)}.${text.substr(6, 3)}`;
        break;
      case 10:
        text = `${text.substr(0, 3)}.${text.substr(3, 3)}.${text.substr(
          6,
          3,
        )}-${text.substr(9, 1)}`;
        break;
      case 11:
        text = `${text.substr(0, 3)}.${text.substr(3, 3)}.${text.substr(
          6,
          3,
        )}-${text.substr(9, 2)}`;
        break;
      case 12:
        text = `${text.substr(0, 2)}.${text.substr(2, 3)}.${text.substr(
          5,
          3,
        )}/${text.substr(8, 4)}`;
        break;
      case 13:
        text = `${text.substr(0, 2)}.${text.substr(2, 3)}.${text.substr(
          5,
          3,
        )}/${text.substr(8, 4)}-${text.substr(12, 1)}`;
        break;

      default:
        text = texto;
        break;
    }
  }
  set(text);
};
