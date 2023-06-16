import { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg'
import Animated, { useSharedValue, useAnimatedProps, withTiming, withRepeat, withDelay } from 'react-native-reanimated'

const SIZE = 120
const AnimatedPath = Animated.createAnimatedComponent(Path)

export default function Wave({ loading }) {
    const c1y = useSharedValue(0.9)
    const c2y = useSharedValue(1.4)
    const c3y = useSharedValue(0.5)
    const c4y = useSharedValue(0.8)
    const c5y = useSharedValue(0.4)
    const c6y = useSharedValue(0.4)

    const animatedProps = useAnimatedProps(() => {


        const path = [`M -1.05 ${c3y.value}`, `C ${c6y.value} ${c1y.value}, ${c5y.value} ${c2y.value}, 1.8 ${c4y.value}`, `V 1 1.2 `, 'H 0.3'].join(' ')

        return {
            d: path,

        }
    })

    useEffect(() => {
        if (loading) {
            handleWave()
        }
    }, [loading])



    function handleWave() {


        setTimeout(() => {
            c1y.value = withRepeat(withTiming(0.4, { duration: 500 }), -1, true)
            c2y.value = withDelay(100, withRepeat(withTiming(0.4, { duration: 500 }), -1, true))
        }, 200)


        setTimeout(() => {
            c1y.value = withRepeat(withTiming(0.8, { duration: 500 }), -1, true)
            c2y.value = withDelay(100, withRepeat(withTiming(0.2, { duration: 500 }), -1, true))
        }, 500)

        setTimeout(() => {
            c1y.value = withRepeat(withTiming(0.4, { duration: 500 }), -1, true)
            c2y.value = withDelay(100, withRepeat(withTiming(0.4, { duration: 500 }), -1, true))
            c3y.value = withTiming(0.3, { duration: 700 })
            c4y.value = withTiming(0.4, { duration: 700 })

        }, 800)

        setTimeout(() => {
            c3y.value = withTiming(-1.4, { duration: 700 })
            c4y.value = withTiming(-1.3, { duration: 700 })
            c6y.value = withTiming(2, { duration: 800 })
        }, 1000)

    }

    return (

        <Svg style={styles.container} viewBox='0 0 1 1' >
            <Defs>
                <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%"  >
                    <Stop offset="0%" stopColor="#32cd9a" />
                    <Stop offset="10%" stopColor="#7FDBFF" />
                    <Stop offset="20%" stopColor="#32cd9a" />
                    <Stop offset="40%" stopColor="#32cd9a" />
                    <Stop offset="60%" stopColor="#7FDBFF" />
                    <Stop offset="100%" stopColor="#7FDBFF" />
                </LinearGradient>

            </Defs>


            <AnimatedPath fill="url(#gradient)" animatedProps={animatedProps} c />

        </Svg>

    )
}


const styles = StyleSheet.create({
    container: {
        width: SIZE,
        height: SIZE,
        borderRadius: 60,
        overflow: 'hidden',
        opacity: 0.75,
    }
})