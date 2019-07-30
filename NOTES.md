# Notes

## 7/30
A skill system which influences abilities might be handled by creating a Battle Parameters object, collecting some preliminary info, then by passing the BP to each skill along an influence chain, the individual skill could augment the ability. Then the BP would be passed to the ability to determine the final outcome. This should allow for better extendability, as each new skill could augment abilities by type, by particular skill, or both.
By first collecting all current skills or status effects before passing the BP through the influence chain, skills and statuses would be able to co-effect, allowing interesting compounding effects with relative ease.

## 7/26
A higher-order reducer for characters seems like it would allow dynamic character handling in the state -- creating new character states at runtime -- but I've never managed state like that before, so I dunno, would that even work? It seems like a good way to handle generating enemy states for battles, but maybe it's terrible, who knows.