#!/bin/sh
# Simple assembling

in='html/main.html'
out='index.html'

append_date()
{
	printf 'Generate date\n' >&2
	sed -e "
		/<html>/a\\
<!-- Generated date: $(date) -->
	"
}

create_include_css_js()
{
	printf 'Create "include()" macroses for css and js files\n' >&2

	# POSIX version
	sed -e '
		s!<link.*rel="stylesheet".*href="\(.*\)".*/>!<style>include(\1)</style>!i
		s!<script.*src="\(.*\)">!<script>include(\1)!i
	'

	# Perl version
#	perl -pe '
#		s!<link\s+rel="stylesheet"\s+href="(.+)"\s*/>
#		 !<style>include($1)</style>!xi;
#
#		s!<script\s+src="(.+)"\s*>
#		 !<script>include($1)!xi;
#	'
}

expand()
{
	if command -v m4 > /dev/null
	then
		_m4
	elif command -v awk > /dev/null
	then
		_awk
	elif command -v perl > /dev/null
	then
		_perl
	else
		_sed
	fi
}

_m4()
{
	printf "Expand macroses by m4\n" >&2
	{ echo 'changequote({{,}})dnl'; cat; } | m4
}

_awk()
{
	printf "Expand macroses by awk\n" >&2
	awk '
	{
		if ( match($0, /include\(.+\)/) )
		{
			print > "/dev/stderr"

			before = substr($0, 1, RSTART - 1)
			file   = substr($0, RSTART + 8, RLENGTH - 8 - 1)
			after  = substr($0, RSTART + RLENGTH)

			printf "%s", before
			system("cat " file)
			printf "%s\n", after
		}
		else
		{
			print
		}
	}
	'
}

_perl()
{
	printf "Expand macroses by perl\n" >&2
	perl -pe '
		if (/include\((.+)\)/)
		{
			print STDERR;
			$_ = $` . qx|cat \"$1\"| . $'\'';
		}
	'
}

# TODO: OPTIMIZE THIS METHOD
_sed()
{
	printf "Expand macroses by sed\n" >&2
	local incBRE='\(.*\)include(\(.\{1,\}\))\(.*\)'
	local incERE='(.*)include\((.+)\)(.*)'
	local old_IFS=$IFS
	IFS=$'\n'
	while read line
	do
		if echo "$line" | grep -e "$incBRE" > /dev/stderr
		then
			echo "$line" | sed -e "s/$incBRE/\1/" | tr -d '\n'
			cat "$(echo "$line" | sed -e "s/$incBRE/\2/")"
			echo "$line" | sed -e "s/$incBRE/\3/"
		else
			echo "$line"
		fi
	done
	local IFS=$old_IFS
}

append_date < "$in" | create_include_css_js | expand > "$out"

#for i in _m4 _awk _sed _perl
#do
#	time ( append_date < "$in" | create_include_css_js | $i > "$out$i" )
#done
