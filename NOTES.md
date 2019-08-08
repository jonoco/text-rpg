# Notes

## 8/5
Continuing with the design of allowing abilities to hold maximum flexibility, they can individually modify the influence of item attributes.

The trouble of polling an ability's target to gauge how their attributes (e.g., defence) will influence the ability is still unsorted. Either the ability will to consider the target's stats to calculate the final outcome -giving a huge responsibility to individual abilities- or by passing a battle parameter between the ability and the target, allowing the ability to check for target augmentations. The lifecycle might look like:
    Battle -> skills augments -> ability -> items augments -> target augments -> ability outcome

Item augments are handled per ability due to item variability.

## 7/30
A skill system which influences abilities might be handled by creating a Battle Parameters object, collecting some preliminary info, then by passing the BP to each skill along an influence chain, the individual skill could augment the ability. Then the BP would be passed to the ability to determine the final outcome. This should allow for better extendability, as each new skill could augment abilities by type, by particular skill, or both.
By first collecting all current skills or status effects before passing the BP through the influence chain, skills and statuses would be able to co-effect, allowing interesting compounding effects with relative ease.

## 7/26
A higher-order reducer for characters seems like it would allow dynamic character handling in the state -- creating new character states at runtime -- but I've never managed state like that before, so I dunno, would that even work? It seems like a good way to handle generating enemy states for battles, but maybe it's terrible, who knows.