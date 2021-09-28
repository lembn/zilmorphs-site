import { Button } from "grommet";

export const But = ({ label, onClick }) => {
    return (
        <Button
            label={label}
            plain
            style={{ fontWeight: "bold" }}
            size="large"
            onClick={() => onClick()}
        />
    );
};
