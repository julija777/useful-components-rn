import { renderHook } from '@testing-library/react-hooks';
import { useStreak } from '../useStreak';

describe('useStreak', () => {
  it('should throw an error if streak is not an array', () => {
    expect(() => {
      renderHook(() => useStreak('not an array' as any, '2024-04-04'));
    }).toThrow('streak must be an array');
  });

  it('should return correct streak type for different streak lengths', () => {
    const { result: singleStreak } = renderHook(() => useStreak(['2024-04-04'], '2024-04-04'));
    expect(singleStreak.current.streakType).toBe('single');

    const { result: fourStreak } = renderHook(() => 
      useStreak(['2024-04-01', '2024-04-02', '2024-04-03', '2024-04-04'], '2024-04-04')
    );
    expect(fourStreak.current.streakType).toBe('four');

    const { result: perfectStreak } = renderHook(() => 
      useStreak(Array(7).fill('2024-04-04'), '2024-04-04')
    );
    expect(perfectStreak.current.streakType).toBe('perfect');

    const { result: nineStreak } = renderHook(() => 
      useStreak(Array(9).fill('2024-04-04'), '2024-04-04')
    );
    expect(nineStreak.current.streakType).toBe('nine');

    const { result: otherStreak } = renderHook(() => 
      useStreak(Array(5).fill('2024-04-04'), '2024-04-04')
    );
    expect(otherStreak.current.streakType).toBe('other');
  });

  it('should calculate perfect week days correctly', () => {
    const { result } = renderHook(() => 
      useStreak(Array(14).fill('2024-04-04'), '2024-04-04')
    );
    expect(result.current.perfectWeekDays).toEqual([7, 14]);
  });

  it('should return the correct current date', () => {
    const currentDate = '2024-04-04';
    const { result } = renderHook(() => useStreak(['2024-04-04'], currentDate));
    expect(result.current.currentDate).toBe(currentDate);
  });
}); 