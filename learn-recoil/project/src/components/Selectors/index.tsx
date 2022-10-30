import {
    Box,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Icon,
    NumberInput,
    NumberInputField,
    Switch,
} from '@chakra-ui/react'
import {ArrowRight} from 'react-feather'
import {atom, selector, useRecoilState} from 'recoil'

const exchangeRate = 0.83

const usdAtom = atom({
    key: 'usd',
    default: 1,
})

const euroSelector = selector<number>({
    key: 'euro',
    get: ({get}) => {
        let usd = get(usdAtom)
        const isEnabledCommission = get(commissionEnabledAtom)
        if (isEnabledCommission) {
            const commission = get(commissionAtom)
            usd = removeCommission(usd, commission)
        }
        return usd * exchangeRate
    },
    set: ({set, get}, newValue) => {
        // @ts-ignore
        let newUsd = newValue / exchangeRate
        const isEnabledCommission = get(commissionEnabledAtom)
        if (isEnabledCommission) {
            const commission = get(commissionAtom)
            newUsd = addCommission(newUsd, commission)
        }
        set(usdAtom, newUsd)
    },
})

export const Selectors = () => {
    const [usd, setUsd] = useRecoilState(usdAtom)
    const [euro, setEuro] = useRecoilState(euroSelector)

    return (
        <div style={{padding: 20}}>
            <Heading size="lg" mb={2}>
                Currency converter
            </Heading>
            <InputStack>
                <CurrencyInput label="usd" amount={usd} onChange={(usd) => setUsd(usd)} />
                <CurrencyInput label="eur" amount={euro} onChange={(euro) => setEuro(euro)} />
            </InputStack>
            <Commission />
        </div>
    )
}

const InputStack: React.FC = ({children}) => {
    return (
        <HStack
            width="300px"
            mb={4}
            spacing={4}
            divider={
                <Box border="0 !important" height="40px" alignItems="center" display="flex">
                    <Icon as={ArrowRight} />
                </Box>
            }
            align="flex-end"
        >
            {children}
        </HStack>
    )
}

const CurrencyInput = ({
    amount,
    onChange,
    label,
}: {
    label: string
    amount: number
    onChange?: (amount: number) => void
}) => {
    let symbol = label === 'usd' ? '$' : '€'

    return (
        <FormControl id={label.toUpperCase()}>
            <FormLabel>{label.toUpperCase()}</FormLabel>
            <NumberInput
                value={`${symbol} ${amount}`}
                onChange={(value) => {
                    const withoutSymbol = value.split(' ')[0]
                    onChange?.(parseFloat(withoutSymbol || '0'))
                }}
            >
                <NumberInputField />
            </NumberInput>
        </FormControl>
    )
}

const commissionEnabledAtom = atom({
    key: 'commissionEnabled',
    default: false,
})

const commissionAtom = atom({
    key: 'commission',
    default: 5,
})

const Commission = () => {
    const [enabled, setEnabled] = useRecoilState(commissionEnabledAtom)
    const [commission, setCommission] = useRecoilState(commissionAtom)

    return (
        <Box width="300px">
            <FormControl display="flex" alignItems="center" mb={2}>
                <FormLabel htmlFor="includeCommission" mb="0">
                    Include forex commission?
                </FormLabel>
                <Switch
                    id="includeCommission"
                    isChecked={enabled}
                    onChange={(event) => setEnabled(event.currentTarget.checked)}
                />
            </FormControl>
            <NumberInput
                isDisabled={!enabled}
                value={commission}
                onChange={(value) => setCommission(parseFloat(value || '0'))}
            >
                <NumberInputField />
            </NumberInput>
        </Box>
    )
}

const addCommission = (amount: number, commission: number) => {
    return amount / (1 - commission / 100)
}

const removeCommission = (amount: number, commission: number) => {
    return amount * (1 - commission / 100)
}
