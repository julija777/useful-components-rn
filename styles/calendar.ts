import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
export const DAY_SIZE = Math.floor((width - 40) / 8);

export const calendarStyles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#000',
    borderRadius: 10,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    width: '100%',
  },
  weekDayContainer: {
    width: DAY_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDayText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  calendarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  dayWrapper: {
    position: 'relative',
    height: DAY_SIZE,
    width: DAY_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayContainer: {
    height: DAY_SIZE,
    width: DAY_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  connectingLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#666',
    top: '50%',
    left: '50%',
    zIndex: -1,
  },
}); 