import { Button } from "grommet";

export const But = ({
    label,
    onClick,
    fontSize,
}: {
    label: string;
    onClick: any;
    fontSize?: string;
}) => {
    return (
        <Button
            label={label}
            plain
            style={{ fontWeight: "bold", fontSize: fontSize ? fontSize : null }}
            onClick={() => onClick()}
        />
    );
};
