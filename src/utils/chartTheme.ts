import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { useThemeStore } from '@/stores/theme';

export const getChartTheme = () => {
  const themeStore = useThemeStore();
  const isDark = themeStore.isDark;

  return {
    textColor: isDark ? '#e5e5e5' : '#333333',
    textMuted: isDark ? '#888888' : '#666666',
    axisLineColor: isDark ? '#404040' : '#cccccc',
    splitLineColor: isDark ? '#333333' : '#e5e5e5',
    tooltipBg: isDark ? 'rgba(42, 42, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    tooltipText: isDark ? '#e5e5e5' : '#333333',
    tooltipBorder: isDark ? '#555555' : '#cccccc',
  };
};

export const getBarChartOption = (
  xData: string[],
  yData: number[],
  gradientColors: [string, string]
): EChartsOption => {
  const theme = getChartTheme();

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: {
        type: 'shadow' as const
      },
      backgroundColor: theme.tooltipBg,
      borderColor: theme.tooltipBorder,
      textStyle: {
        color: theme.tooltipText
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category' as const,
        data: xData,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          rotate: 20,
          color: theme.textMuted,
          fontSize: 11
        },
        axisLine: {
          lineStyle: {
            color: theme.axisLineColor
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value' as const,
        axisLabel: {
          color: theme.textMuted
        },
        axisLine: {
          lineStyle: {
            color: theme.axisLineColor
          }
        },
        splitLine: {
          lineStyle: {
            color: theme.splitLineColor,
            type: 'dashed' as const
          }
        }
      }
    ],
    series: [
      {
        name: 'Count',
        type: 'bar' as const,
        barWidth: '60%',
        data: yData,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
            { offset: 0, color: gradientColors[0] },
            { offset: 1, color: gradientColors[1] }
          ])
        }
      }
    ]
  };
};

export const getPieChartOption = (
  data: { value: number; name: string; itemStyle?: any }[]
): EChartsOption => {
  const theme = getChartTheme();

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item' as const,
      backgroundColor: theme.tooltipBg,
      borderColor: theme.tooltipBorder,
      textStyle: {
        color: theme.tooltipText
      }
    },
    legend: {
      top: '5%',
      left: 'center',
      textStyle: {
        color: theme.textColor
      }
    },
    series: [
      {
        name: 'Data',
        type: 'pie' as const,
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold' as const,
            color: theme.textColor
          }
        },
        labelLine: {
          show: false
        },
        data: data.length > 0 ? data : [{ value: 0, name: 'No Data', itemStyle: { color: theme.textMuted } }]
      }
    ]
  };
};
