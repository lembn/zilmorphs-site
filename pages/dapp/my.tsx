import { observer } from "mobx-react-lite";
import { Box, Heading } from "grommet";
import { useRouter } from "next/router";
import { makeAutoObservable, runInAction } from "mobx";
import { ApiMorph } from "../../data/interfaces";
import { useEffect } from "react";
import { Card } from "../../components/Card";
import { walletManager } from "../../state/WalletManager";
import { Footer } from "../../components/Main/Footer";
import { multiple } from "../../state/DispMultiple";

export default observer(() => {
    useEffect(() => {
        multiple.get(...walletManager.owned);
    }, [walletManager.owned]);

    useEffect(() => {
        walletManager.update();
    }, []);

    return (
        <>
            <Box flex="grow" justify="center" gap="medium">
                <Box
                    direction="row"
                    height="medium"
                    width="medium"
                    align="center"
                    pad="large"
                    justify="center"
                    fill
                    wrap
                >
                    {multiple.morphs.length == 0 ? (
                        <Heading level="2">{`you have no morphs :(`}</Heading>
                    ) : (
                        multiple.morphs.map((m) => (
                            <Card morph={m} key={m.num} owned />
                        ))
                    )}
                </Box>
            </Box>
        </>
    );
});
