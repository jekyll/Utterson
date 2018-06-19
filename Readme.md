# Utterson

Utterson investigates Jekyll's performance. Compare different versions of Jekyll
(or even specific PRs/commits) to see how changes might affect performance.

## Usage

### Running tests

To test the current Jekyll `master` branch:

```sh
./bench
```

To test a Pull Request:

```sh
PR=1234 ./bench
```

To test a version:

```sh
REF=v3.8.2 ./bench
```

### Creating reports

Once multiple tests have been run, generate a report showing differences in
total build time with the command:

```sh
./report
```

Reports will show total build time for all sites using each tested version:

```text
| ref                                      | build time in seconds |
|:-----------------------------------------|----------------------:|
| `v3.8.2`                                 |                287.54 |
| `v3.7.3`                                 |                317.74 |
| `v3.6.2`                                 |                295.49 |
| `v3.5.2`                                 |                297.94 |
```
