import { statsDisp } from "../state/StatsDisp";
import { Anchor, Box, Text } from "grommet";
import { tokenDetails, getLink } from "../util/config";
import { observer } from "mobx-react-lite";

export const LiveStats = observer(() => (
    <>
        <Box pad="small">
            <Text weight="bold">{`📈 Live stats:`}</Text>
            <br />
            <Text>{`Market cap: ${statsDisp.cap} ZIL`}</Text>
            <Text>{`Total supply: ${statsDisp.total} ${tokenDetails.symbol}`}</Text>
            <Text>{`Average token price ${statsDisp.avg} ZIL`}</Text>
            <Anchor
                href={getLink()}
                label={`${tokenDetails.emoji} ${tokenDetails.symbol} Smart Contract`}
            />
        </Box>
    </>
));
