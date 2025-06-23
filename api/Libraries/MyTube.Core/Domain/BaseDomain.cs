using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyTube.Core.Domain
{
    public abstract class BaseDomain
    {

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime? DateCreated { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime? DateUpdated { get; set; }

    }

}
