"""
    st_innocent/api/helpers.py
"""

import sys
from typing import List, Union
from api.logger import logger


class HumanBytes:
    """
    Helper for human readable bytes
    """

    METRIC_LABELS: List[str] = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    METRIC_POWERS: List[int] = [1000**i for i in range(len(METRIC_LABELS))]
    METRICS = dict(zip(METRIC_LABELS, METRIC_POWERS))
    BINARY_LABELS: List[str] = [
        "B",
        "KiB",
        "MiB",
        "GiB",
        "TiB",
        "PiB",
        "EiB",
        "ZiB",
        "YiB",
    ]
    PRECISION_OFFSETS: List[float] = [0.5, 0.05, 0.005, 0.0005]
    PRECISION_FORMATS: List[str] = [
        "{}{:.0f} {}",
        "{}{:.1f} {}",
        "{}{:.2f} {}",
        "{}{:.3f} {}",
    ]

    @staticmethod
    def format(num: Union[int, float], metric: bool = True, precision: int = 1) -> str:
        """
        Human-readable formatting of bytes, using binary (powers of 1024)
        or metric (powers of 1000) representation.
        """

        assert isinstance(num, (int, float)), "num must be an int or float"
        assert isinstance(metric, bool), "metric must be a bool"
        assert (
            isinstance(precision, int) and precision >= 0 and precision <= 3
        ), "precision must be an int (range 0-3)"

        unit_labels = HumanBytes.METRIC_LABELS if metric else HumanBytes.BINARY_LABELS
        last_label = unit_labels[-1]
        unit_step = 1000 if metric else 1024
        unit_step_thresh = unit_step - HumanBytes.PRECISION_OFFSETS[precision]

        is_negative = num < 0
        if is_negative:  # Faster than ternary assignment or always running abs().
            num = abs(num)

        for unit in unit_labels:
            if num < unit_step_thresh:
                # VERY IMPORTANT:
                # Only accepts the CURRENT unit if we're BELOW the threshold where
                # float rounding behavior would place us into the NEXT unit: F.ex.
                # when rounding a float to 1 decimal, any number ">= 1023.95" will
                # be rounded to "1024.0". Obviously we don't want ugly output such
                # as "1024.0 KiB", since the proper term for that is "1.0 MiB".
                break
            if unit != last_label:
                # We only shrink the number if we HAVEN'T reached the last unit.
                # NOTE: These looped divisions accumulate floating point rounding
                # errors, but each new division pushes the rounding errors further
                # and further down in the decimals, so it doesn't matter at all.
                num /= unit_step

        return HumanBytes.PRECISION_FORMATS[precision].format(
            "-" if is_negative else "", num, unit
        )

    @staticmethod
    def unformat(
        formatted_num: str, metric: bool = True, precision: int = 1
    ) -> float | int:
        """
        Janky... only unformats metric & doesn't handle negative values.
        """

        if not metric:
            logger.error("Binary unformatting not supported yet.")
            sys.exit(1)

        # reversed so it doesn't short circuit with B
        for label in HumanBytes.METRIC_LABELS[::-1]:
            if label in formatted_num:
                break

        return int(
            float(formatted_num.replace(f" {label}", ""))
            * 10**precision
            * HumanBytes.METRICS[label]
        )
