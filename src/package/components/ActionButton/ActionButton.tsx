import { IconButtonProps, Tooltip } from "@mui/material";
import Styles from "./styles";

interface Props extends IconButtonProps {
  icon: React.ReactNode;
  active?: boolean;
  loading?: boolean;
  tooltip?: string;
}

export const ActionButton = ({
  icon,
  active = false,
  loading = false,
  tooltip,
  ...iconButtonProps
}: Props) => {
  return (
    <Tooltip title={tooltip}>
      <span>
        <Styles.IconButton
          active={`${active}`}
          loading={`${loading}`}
          {...iconButtonProps}
          disabled={loading || iconButtonProps.disabled}
        >
          {icon}
        </Styles.IconButton>
      </span>
    </Tooltip>
  );
};
