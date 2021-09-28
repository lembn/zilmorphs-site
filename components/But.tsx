import { Button } from "grommet";

export const But = ({ label, onClick }) => {
    return (
        <Button
            label={label}
            plain
            style={{ fontSize: "1.1em", fontWeight: "bold" }}
            onClick={() => onClick()}
        />
    );
};
