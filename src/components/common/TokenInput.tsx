import { Input } from "antd";
import { ChangeEvent, FC, useContext } from "react";
import { createUseStyles } from "react-jss";
import cls from 'classnames';
import { ColorThemeContext } from "../../providers/ThemeProvider";

export interface ITokenInputChangeEvent {
  value: string;
  error?: string;
}

interface IProps {
  value: string;
  disabled: boolean;
  onChange: (e: ITokenInputChangeEvent) => void;
  // eslint-disable-next-line react/require-default-props
  clsName?: string; 
}

// const validFloatRegex = /([0-9]*[.])?[0-9]/;
const validFloatRegex = /^[0-9]+[.]?[0-9]*$/;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = createUseStyles((theme) => ({
  actionInput: {
    fontSize: "24px",
    width: "300px",
    fontWeight: 700,
  },
  mobileActionInput: {
    fontSize: "20px",
    width: "auto",
  },
}));
const TokenInput: FC<IProps> = (props) => {
  const classes = useStyles();
  const { value, onChange, clsName = '' } = props;
  const { isMobile } = useContext(ColorThemeContext);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    let isError = false;
    isError = !validFloatRegex.test(val) || Number(val) < 0;
    if (!val) {
      isError = false;
    }
    onChange({
      value: val,
      error: isError ? "Please enter a valid transfer amount." : "",
    });
  };

  return (
    <Input
      id="actionInput"
      className={cls(isMobile ? classes.mobileActionInput : classes.actionInput, clsName)}
      type="text"
      bordered={false}
      size="small"
      value={value}
      onChange={handleChange}
      placeholder="0.0"
      disabled={props?.disabled}
      style={{ paddingLeft: 0 }}
      autoComplete="off"
    />
  );
};

export default TokenInput;
