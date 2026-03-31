
This is a first exploration of various discrete global grid systems (DGGS).

TL;DR: Current plan is just use H3 but later to implement a Snyder equal-area
projection with a Dymaxion orientation (same as orientation used by H3's DGG).
However questions remain about whether hexagons and pentagons should be equal
area, see below for different options.


# Many options for discrete global grids

There are a lot of options for creating a grid on a sphere.  This Wikipedia
article has a good introduction: https://en.wikipedia.org/wiki/Discrete_global_grid

Article from Open Geospatial Consortium's "Discrete Global Grid Systems Abstract Specification":
http://www.opengis.net/doc/AS/dggs/1.0

Article on different ways to optimise a DGG's orientation: https://richard.science/sci/2019_barnes_dgg_published.pdf

## Snyder equal-area projection

Will attempt to implement a Snyder equal-area projection https://en.wikipedia.org/wiki/Snyder_equal-area_projection https://utppublishing.com/doi/10.3138/27H7-8K88-4882-1752
With a https://en.wikipedia.org/wiki/Dymaxion_map similar to H3's hexagonal grid.
This will allow for a hierarchical binning of data similar to H3 but with more
equal areas to make simulations easier to reason about / implement / communicate
to users e.g. choosing a hexagon (at some resolution) should yield the same
result instead of a result up to x2 different (which is what happens with H3).


### How to implement Dymaxion orientation

The page https://www.discreteglobalgrids.org/dgg-orientation/ provides angles for Buckminster Fuller’s Dymaxion Orientation
> The Dymaxion orientation of R. Buckminster Fuller can be specified by placing one icosahedron vertex at 5.245390W longitude, 2.3008820N latitude, and placing an adjacent vertex at an azimuth of 7.466580 from the first vertex.

However I think this is incorrect as on H3 the cell 8075fffffffffff has a
Lat./Lon.: 2.300882, -5.245390 which is the same as the first lat lon stated but
the nearest adjacent vertex is at 8009fffffffffff which has a Lat./Lon. of:
64.70000, 10.53620 not the expected Lon. of -5.245390+7.466580 == 2.22119

### Should hexagons and pentagons be equal area?

Advantages of equal areas:
* User can choose a hexagon or pentagon at some resolution and know that
  it will be the same area as any other hexagon or pentagon at that resolution.
* Makes it easier / slightly less error prone build simulations
* Makes it easier to communicate data/actions to users.

Disadvantages of equal areas:
* It is not how Snyder equal-area projection works, so it would require a
    different system / more complexity.


Currently undecided between:
1. all triangles are the same area (e.g. pure Snyder equal-area projection) but
this means that hexagons and pentagons are not equal area.
2. make all hexagons and pentagons the same area only at resolution 1.
2. make all hexagons and pentagons the same area across resolutions.

Currently believe it would be possible to implement option 2 & 3 (equal area for
pentagons and hexagons) but that either this would then prevent the heirarchical
binning of data that H3 provides if this was done at all resolutions.
Or if the pentagons at "resolution 1" (when hexagons are first introduced) were
scaled to be the same size as the hexagons then on more granular resolutions
where pentagons are subdivided into 5 hexagons and 1 pentagon, and hexagons
are subdivided into 7 hexagons, then the hexagons and pentagons below a top level
would again diverge in size... and infact the hexagons under resolution 1
pentagons would be larger than other hexagons under a resolution 1 hexagon.

https://docs.google.com/drawings/d/1UvdCpR2HUkK71PnpuOCMt5ZyiNtxTJAAArmolw2Gbdk/edit?usp=sharing
