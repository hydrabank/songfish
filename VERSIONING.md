# Versioning and update scheme

Before the *2022 New Year's Update*, Songfish used a traditional semantic versioning scheme. This is generally classified as `major.minor.patch`. You can read about the traditional semantic versioning scheme [here](https://semver.org/). Releases prior to the update were tagged `1.0.0`, `1.1.0`, etc.

However, from the *2022 New Year's Update*, Songfish has started using a new semver-compatible scheme that follows the format of `2-digit-year.milestone.month.patch`. For example, the version of the New Year's update is `22.0.1.0`, instead of the traditional `1.3`.

Along with the new versioning scheme, Songfish development now follows milestones. Each milestone contains specific sets of changes containing new features, bug fixes, and improvements. This is lightly inspired by the Windows 10 milestone system. However, since [public-facing] instances of Songfish do not have a fixed feature-drop or update schedule due to the rolling-release nature of the project, these milestones can be called for at any time. For example, while Songfish will receive updates for a specific future milestone over time, only the *upcoming* update at the time of a given milestone's effective announcement will be considered part of the new milestone, regardless of whether or not previous updates have features that are part of the new milestone.

It is for this reason that milestones can also be considered "development cycles", as releases following the first release of a given milestone can be considered part of the *next* milestone.

The only exception to the milestone rules is the *2022 New Year's Update*, which is versioned as `22.0.1.0`. Pre-release versions in the 22.0.1.0 milestone cycle are tagged as `22.0.1.0-pre`, followed by a sequential number. After `22.0.1.0`'s final release, following releases are considered to be releases that are part of the next milestone.